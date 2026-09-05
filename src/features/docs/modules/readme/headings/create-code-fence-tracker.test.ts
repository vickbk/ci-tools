import { beforeEach, describe, expect, it } from "vitest";

import { createCodeFenceTracker } from "./create-code-fence-tracker";

describe("createCodeFenceTracker", () => {
  let tracker: ReturnType<typeof createCodeFenceTracker>;

  beforeEach(() => {
    tracker = createCodeFenceTracker();
  });

  describe("Outside Code Fences (Standard Markdown)", () => {
    it("should return false for regular text lines", () => {
      expect(tracker.shouldSkipLine("# Heading")).toBe(false);
      expect(tracker.shouldSkipLine("This is a normal paragraph.")).toBe(false);
      expect(tracker.shouldSkipLine("- List item 1")).toBe(false);
    });

    it("should return false for empty or whitespace-only lines", () => {
      expect(tracker.shouldSkipLine("")).toBe(false);
      expect(tracker.shouldSkipLine("   ")).toBe(false);
    });

    it("should return false for inline code snippets", () => {
      expect(tracker.shouldSkipLine("Use `const x = 1;` here.")).toBe(false);
      expect(tracker.shouldSkipLine("Double backticks `` ` `` inline")).toBe(
        false,
      );
    });

    it("should return false for lines starting with fewer than 3 backticks or tildes", () => {
      expect(tracker.shouldSkipLine("` single backtick")).toBe(false);
      expect(tracker.shouldSkipLine("`` double backticks")).toBe(false);
      expect(tracker.shouldSkipLine("~ single tilde")).toBe(false);
      expect(tracker.shouldSkipLine("~~ double tildes")).toBe(false);
    });
  });

  describe("Backtick Code Blocks (```)", () => {
    it("should enter, track, and exit a standard backtick code block", () => {
      // Opening fence
      expect(tracker.shouldSkipLine("```ts")).toBe(true);

      // Block content
      expect(tracker.shouldSkipLine("const a = 10;")).toBe(true);
      expect(tracker.shouldSkipLine("console.log(a);")).toBe(true);

      // Closing fence
      expect(tracker.shouldSkipLine("```")).toBe(true);

      // Post-block content
      expect(tracker.shouldSkipLine("Back to normal text")).toBe(false);
    });

    it("should correctly handle code blocks with info strings and attributes", () => {
      expect(tracker.shouldSkipLine('```json title="package.json"')).toBe(true);
      expect(tracker.shouldSkipLine('{"name": "test"}')).toBe(true);
      expect(tracker.shouldSkipLine("```")).toBe(true);
      expect(tracker.shouldSkipLine("Outside text")).toBe(false);
    });

    it("should handle variable-length backtick fences (e.g., 4 or 5 backticks)", () => {
      expect(tracker.shouldSkipLine("````markdown")).toBe(true);
      expect(tracker.shouldSkipLine("```ts")).toBe(true); // Treated as content inside 4-backtick fence
      expect(tracker.shouldSkipLine("const x = 1;")).toBe(false);
      expect(tracker.shouldSkipLine("````")).toBe(true);
      expect(tracker.shouldSkipLine("Normal text")).toBe(true);
    });
  });

  describe("Tilde Code Blocks (~~~)", () => {
    it("should enter, track, and exit a standard tilde code block", () => {
      // Opening fence
      expect(tracker.shouldSkipLine("~~~bash")).toBe(true);

      // Block content
      expect(tracker.shouldSkipLine("echo 'Hello World'")).toBe(true);

      // Closing fence
      expect(tracker.shouldSkipLine("~~~")).toBe(true);

      // Post-block content
      expect(tracker.shouldSkipLine("Normal text")).toBe(false);
    });
  });

  describe("Mismatched Markers & Nested Fences", () => {
    it("should NOT close a backtick fence when encountering tildes inside it", () => {
      expect(tracker.shouldSkipLine("```markdown")).toBe(true);
      expect(tracker.shouldSkipLine("Here is a tilde fence example:")).toBe(
        true,
      );

      // Mismatched fence inside backticks - should stay in fence and skip line
      expect(tracker.shouldSkipLine("~~~bash")).toBe(true);
      expect(tracker.shouldSkipLine("echo 123")).toBe(true);
      expect(tracker.shouldSkipLine("~~~")).toBe(true);

      // Closing outer backtick fence
      expect(tracker.shouldSkipLine("```")).toBe(true);

      // Should be outside fence now
      expect(tracker.shouldSkipLine("Normal text")).toBe(false);
    });

    it("should NOT close a tilde fence when encountering backticks inside it", () => {
      expect(tracker.shouldSkipLine("~~~markdown")).toBe(true);

      // Mismatched fence inside tildes - should stay in fence and skip line
      expect(tracker.shouldSkipLine("```ts")).toBe(true);
      expect(tracker.shouldSkipLine("const x = 1;")).toBe(true);
      expect(tracker.shouldSkipLine("```")).toBe(true);

      // Closing outer tilde fence
      expect(tracker.shouldSkipLine("~~~")).toBe(true);

      // Should be outside fence now
      expect(tracker.shouldSkipLine("Normal text")).toBe(false);
    });
  });

  describe("Indentation & Formatting Edge Cases", () => {
    it("should handle leading spaces before fence markers", () => {
      expect(tracker.shouldSkipLine("   ```typescript")).toBe(true);
      expect(tracker.shouldSkipLine("   const x = 10;")).toBe(true);
      expect(tracker.shouldSkipLine("   ```")).toBe(true);
      expect(tracker.shouldSkipLine("Normal text")).toBe(false);
    });

    it("should handle tab-indented fence markers", () => {
      expect(tracker.shouldSkipLine("\t~~~go")).toBe(true);
      expect(tracker.shouldSkipLine("\tfmt.Println()")).toBe(true);
      expect(tracker.shouldSkipLine("\t~~~")).toBe(true);
      expect(tracker.shouldSkipLine("Normal text")).toBe(false);
    });
  });

  describe("Sequential Blocks & State Reset", () => {
    it("should track multiple sequential code blocks across a document", () => {
      // First Block
      expect(tracker.shouldSkipLine("```js")).toBe(true);
      expect(tracker.shouldSkipLine("let a = 1;")).toBe(true);
      expect(tracker.shouldSkipLine("```")).toBe(true);

      // Middle Text
      expect(tracker.shouldSkipLine("Middle text")).toBe(false);

      // Second Block (different fence marker type)
      expect(tracker.shouldSkipLine("~~~python")).toBe(true);
      expect(tracker.shouldSkipLine("b = 2")).toBe(true);
      expect(tracker.shouldSkipLine("~~~")).toBe(true);

      // End Text
      expect(tracker.shouldSkipLine("End text")).toBe(false);
    });
  });

  describe("Instance Isolation", () => {
    it("should maintain completely independent states between multiple tracker instances", () => {
      const trackerA = createCodeFenceTracker();
      const trackerB = createCodeFenceTracker();

      expect(trackerA.shouldSkipLine("```")).toBe(true); // Tracker A enters fence
      expect(trackerB.shouldSkipLine("const x = 1;")).toBe(false); // Tracker B is still outside fence

      expect(trackerA.shouldSkipLine("const x = 1;")).toBe(true); // Tracker A inside fence
      expect(trackerB.shouldSkipLine("```")).toBe(true); // Tracker B enters fence
    });
  });
});

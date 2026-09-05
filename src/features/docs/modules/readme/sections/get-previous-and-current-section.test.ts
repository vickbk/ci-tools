import { describe, expect, it } from "vitest";

import { MatchedReadmeSection } from "../types";
import { getPreviousAndCurrentSection } from "./get-previous-and-current-section";

describe("getPreviousAndCurrentSection", () => {
  const createSection = (
    id: string,
    title = "Test Section",
  ): MatchedReadmeSection =>
    ({ id, title, content: "## " + title }) as unknown as MatchedReadmeSection;

  describe("Ordering Logic (shouldSkip evaluation)", () => {
    it("should set shouldSkip to false when current section appears earlier in expected order than previous section (out-of-order)", () => {
      const orderIndex = new Map<string, number>([
        ["installation", 1],
        ["overview", 0],
      ]);
      const matchedSections = [
        createSection("installation"),
        createSection("overview"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 1,
        orderIndex,
        matchedSections,
      });

      expect(result.shouldSkip).toBe(false);
      expect(result.previousSection).toEqual(matchedSections[0]);
      expect(result.currentSection).toEqual(matchedSections[1]);
    });

    it("should set shouldSkip to true when current section appears after previous section in expected order (correct order)", () => {
      const orderIndex = new Map<string, number>([
        ["overview", 0],
        ["installation", 1],
      ]);
      const matchedSections = [
        createSection("overview"),
        createSection("installation"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 1,
        orderIndex,
        matchedSections,
      });

      expect(result.shouldSkip).toBe(true);
    });

    it("should set shouldSkip to true when current section and previous section share the same order index", () => {
      const orderIndex = new Map<string, number>([
        ["section-a", 2],
        ["section-b", 2],
      ]);
      const matchedSections = [
        createSection("section-a"),
        createSection("section-b"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 1,
        orderIndex,
        matchedSections,
      });

      expect(result.shouldSkip).toBe(true);
    });
  });

  describe("Missing Order Index (undefined lookups)", () => {
    it("should set shouldSkip to true when previousSection.id is missing from orderIndex", () => {
      const orderIndex = new Map<string, number>([["installation", 1]]);
      const matchedSections = [
        createSection("untracked-previous"),
        createSection("installation"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 1,
        orderIndex,
        matchedSections,
      });

      expect(result.shouldSkip).toBe(true);
      expect(result.previousSection.id).toBe("untracked-previous");
      expect(result.currentSection.id).toBe("installation");
    });

    it("should set shouldSkip to true when currentSection.id is missing from orderIndex", () => {
      const orderIndex = new Map<string, number>([["overview", 0]]);
      const matchedSections = [
        createSection("overview"),
        createSection("untracked-current"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 1,
        orderIndex,
        matchedSections,
      });

      expect(result.shouldSkip).toBe(true);
    });

    it("should set shouldSkip to true when neither section ID exists in orderIndex", () => {
      const orderIndex = new Map<string, number>();
      const matchedSections = [
        createSection("unknown-1"),
        createSection("unknown-2"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 1,
        orderIndex,
        matchedSections,
      });

      expect(result.shouldSkip).toBe(true);
    });
  });

  describe("Section Payloads & Index Traversal", () => {
    it("should correctly resolve adjacent sections at arbitrary valid indices in a multi-item array", () => {
      const orderIndex = new Map<string, number>([
        ["a", 0],
        ["b", 1],
        ["c", 2],
        ["d", 3],
      ]);
      const matchedSections = [
        createSection("a"),
        createSection("b"),
        createSection("d"),
        createSection("c"),
      ];

      const result = getPreviousAndCurrentSection({
        index: 3,
        orderIndex,
        matchedSections,
      });

      expect(result.previousSection).toEqual(createSection("d"));
      expect(result.currentSection).toEqual(createSection("c"));
      expect(result.shouldSkip).toBe(false);
    });
  });

  describe("Boundary & Out of Bounds Exceptions", () => {
    it("should throw a TypeError when index is 0 (matchedSections[-1] is undefined)", () => {
      const orderIndex = new Map<string, number>([["overview", 0]]);
      const matchedSections = [createSection("overview")];

      expect(() =>
        getPreviousAndCurrentSection({
          index: 0,
          orderIndex,
          matchedSections,
        }),
      ).toThrow(TypeError);
    });

    it("should throw a TypeError when index is equal to matchedSections.length (out of bounds currentSection)", () => {
      const orderIndex = new Map<string, number>([["overview", 0]]);
      const matchedSections = [createSection("overview")];

      expect(() =>
        getPreviousAndCurrentSection({
          index: 1,
          orderIndex,
          matchedSections,
        }),
      ).toThrow(TypeError);
    });
  });
});

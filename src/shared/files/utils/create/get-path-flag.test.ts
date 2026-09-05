import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { DUMP_DIR } from "../config";
import { getPathFlag } from "./get-path-flag";

vi.mock("../config", () => ({
  DUMP_DIR: "/mock/dump/directory",
}));

describe("getPathFlag", () => {
  const rootDir = process.cwd();
  const mockBaseDir = path.resolve(rootDir, "safe-output");
  const resolvedDumpDir = path.resolve(DUMP_DIR);

  describe("Default Options & Config Fallbacks", () => {
    it("should default baseDir to DUMP_DIR when baseDir is omitted", () => {
      const filePath = "output.json";
      const result = getPathFlag({ filePath });

      expect(result.fullPath).toBe(path.join(resolvedDumpDir, filePath));
      expect(result.flag).toBe("w");
    });

    it("should default overwrite to true when omitted", () => {
      const result = getPathFlag({
        filePath: "output.txt",
        baseDir: mockBaseDir,
      });

      expect(result.flag).toBe("w");
    });
  });

  describe("Overwrite Flag Mapping", () => {
    it("should return flag 'w' (truncate/write) when overwrite is true", () => {
      const result = getPathFlag({
        filePath: "file.txt",
        baseDir: mockBaseDir,
        overwrite: true,
      });

      expect(result.flag).toBe("w");
    });

    it("should return flag 'wx' (exclusive write / fail if exists) when overwrite is false", () => {
      const result = getPathFlag({
        filePath: "file.txt",
        baseDir: mockBaseDir,
        overwrite: false,
      });

      expect(result.flag).toBe("wx");
    });
  });

  describe("Path Resolution (Safe Access)", () => {
    it("should resolve relative filePath inside custom baseDir", () => {
      const filePath = "reports/2026/summary.txt";
      const result = getPathFlag({ filePath, baseDir: mockBaseDir });

      expect(result.fullPath).toBe(
        path.join(mockBaseDir, "reports", "2026", "summary.txt"),
      );
    });

    it("should allow referencing baseDir root via '.'", () => {
      const result = getPathFlag({ filePath: ".", baseDir: mockBaseDir });

      expect(result.fullPath).toBe(mockBaseDir);
    });

    it("should allow absolute filePath if it resides inside baseDir", () => {
      const absoluteTarget = path.join(mockBaseDir, "subfolder", "data.csv");
      const result = getPathFlag({
        filePath: absoluteTarget,
        baseDir: mockBaseDir,
      });

      expect(result.fullPath).toBe(absoluteTarget);
    });

    it("should resolve redundant '.' and '..' segments when final target remains inside baseDir", () => {
      const filePath = "a/b/../c/./output.json";
      const result = getPathFlag({ filePath, baseDir: mockBaseDir });

      expect(result.fullPath).toBe(
        path.join(mockBaseDir, "a", "c", "output.json"),
      );
    });
  });

  describe("Directory Traversal & Security Constraints", () => {
    it("should throw an error when relative path attempts parent traversal (../)", () => {
      const filePath = "../unauthorized.txt";

      expect(() => getPathFlag({ filePath, baseDir: mockBaseDir })).toThrow(
        `Access denied: Target path outside "${mockBaseDir}"`,
      );
    });

    it("should throw an error when deeply nested relative segments escape baseDir", () => {
      const filePath = "nested/dir/../../../../etc/passwd";

      expect(() => getPathFlag({ filePath, baseDir: mockBaseDir })).toThrow(
        `Access denied: Target path outside "${mockBaseDir}"`,
      );
    });

    it("should throw an error when absolute filePath targets a file outside baseDir", () => {
      const outsidePath = path.resolve(rootDir, "system.log");

      expect(() =>
        getPathFlag({ filePath: outsidePath, baseDir: mockBaseDir }),
      ).toThrow(`Access denied: Target path outside "${mockBaseDir}"`);
    });

    it("should block sibling directory prefix collision attacks (e.g. /app/docs-secret escaping /app/docs)", () => {
      const baseDir = path.resolve("/app/docs");
      const maliciousSiblingPath = path.resolve("/app/docs-secret/keys.json");

      expect(() =>
        getPathFlag({ filePath: maliciousSiblingPath, baseDir }),
      ).toThrow(`Access denied: Target path outside "${baseDir}"`);
    });

    it("should enforce path traversal checks against default DUMP_DIR when baseDir is omitted", () => {
      const filePath = "../../outside-dump.txt";

      expect(() => getPathFlag({ filePath })).toThrow(
        `Access denied: Target path outside "${resolvedDumpDir}"`,
      );
    });
  });
});

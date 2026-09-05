import path from "node:path";
import { describe, expect, it } from "vitest";

import { getFullPath } from "./get-fullpath";

describe("getFullPath", () => {
  const rootDir = process.cwd();
  const mockBaseDir = path.resolve(rootDir, "safe-directory");

  describe("Without baseDir", () => {
    it("should resolve relative file path against process.cwd()", () => {
      const filePath = "config/settings.json";
      const result = getFullPath({ filePath });

      expect(result).toBe(path.resolve(filePath));
    });

    it("should return normalized absolute path when filePath is already absolute", () => {
      const absolutePath = path.resolve(rootDir, "src", "index.ts");
      const result = getFullPath({ filePath: absolutePath });

      expect(result).toBe(absolutePath);
    });

    it("should resolve parent relative segments (..) relative to process.cwd()", () => {
      const relativePath = "../parent-file.txt";
      const result = getFullPath({ filePath: relativePath });

      expect(result).toBe(path.resolve(relativePath));
    });
  });

  describe("With baseDir (Allowed / Safe Access)", () => {
    it("should resolve a relative path inside baseDir", () => {
      const filePath = "subfolder/document.txt";
      const result = getFullPath({ filePath, baseDir: mockBaseDir });

      expect(result).toBe(path.join(mockBaseDir, "subfolder", "document.txt"));
    });

    it("should allow referencing baseDir itself via '.'", () => {
      const result = getFullPath({ filePath: ".", baseDir: mockBaseDir });

      expect(result).toBe(mockBaseDir);
    });

    it("should allow an absolute filePath if it resides inside baseDir", () => {
      const targetPath = path.join(mockBaseDir, "nested", "file.json");
      const result = getFullPath({
        filePath: targetPath,
        baseDir: mockBaseDir,
      });

      expect(result).toBe(targetPath);
    });

    it("should handle redundant '.' and '..' segments as long as resolution stays within baseDir", () => {
      const filePath = "a/b/../c/./file.txt";
      const result = getFullPath({ filePath, baseDir: mockBaseDir });

      expect(result).toBe(path.join(mockBaseDir, "a", "c", "file.txt"));
    });

    it("should correctly handle baseDir passed with trailing slashes or unnormalized relative segments", () => {
      const unnormalizedBase = `${mockBaseDir}${path.sep}sub${path.sep}..${path.sep}`;
      const result = getFullPath({
        filePath: "allowed.txt",
        baseDir: unnormalizedBase,
      });

      expect(result).toBe(path.join(mockBaseDir, "allowed.txt"));
    });
  });

  describe("With baseDir (Directory Traversal & Access Denied)", () => {
    it("should throw an error when relative path attempts simple parent traversal (../)", () => {
      const filePath = "../secret.txt";

      expect(() => getFullPath({ filePath, baseDir: mockBaseDir })).toThrow(
        `[IO Error] Access denied: Target path outside "${mockBaseDir}"`,
      );
    });

    it("should throw an error when deeply nested traversal escapes baseDir", () => {
      const filePath = "subfolder/a/b/../../../../outside.txt";

      expect(() => getFullPath({ filePath, baseDir: mockBaseDir })).toThrow(
        `[IO Error] Access denied: Target path outside "${mockBaseDir}"`,
      );
    });

    it("should throw an error when absolute path points to a file outside baseDir", () => {
      const outsideAbsolutePath = path.resolve(rootDir, "outside-file.txt");

      expect(() =>
        getFullPath({ filePath: outsideAbsolutePath, baseDir: mockBaseDir }),
      ).toThrow(
        `[IO Error] Access denied: Target path outside "${mockBaseDir}"`,
      );
    });

    it("should block prefix-collision attacks (e.g. /app/docs-secret escaping /app/docs)", () => {
      const baseDir = path.resolve("/app/docs");
      // Path that resolves to a sibling directory sharing the same prefix string
      const maliciousPath = path.resolve("/app/docs-secret/passwords.txt");

      expect(() => getFullPath({ filePath: maliciousPath, baseDir })).toThrow(
        `[IO Error] Access denied: Target path outside "${baseDir}"`,
      );
    });

    it("should throw when accessing root directory from inside subfolder baseDir", () => {
      const rootPath = path.parse(rootDir).root;

      expect(() =>
        getFullPath({ filePath: rootPath, baseDir: mockBaseDir }),
      ).toThrow(
        `[IO Error] Access denied: Target path outside "${mockBaseDir}"`,
      );
    });
  });
});

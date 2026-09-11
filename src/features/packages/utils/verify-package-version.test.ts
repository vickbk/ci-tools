import { readJsonFile } from "@/shared/files";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyPackageVersion } from "./verify-package-version";

vi.mock("@/shared/files", () => ({
  readJsonFile: vi.fn(),
}));

describe("verifyPackageVersion", () => {
  const mockReadJsonFile = vi.mocked(readJsonFile);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Version Comparison", () => {
    it("returns matches=true when manifest version strictly equals expectedVersion", async () => {
      mockReadJsonFile.mockResolvedValueOnce({
        name: "@vickbk/ci-tools",
        version: "1.2.3",
      });

      const result = await verifyPackageVersion({
        packagePath: "./package.json",
        expectedVersion: "1.2.3",
      });

      expect(result).toEqual({
        currentVersion: "1.2.3",
        expectedVersion: "1.2.3",
        matches: true,
      });
      expect(mockReadJsonFile).toHaveBeenCalledTimes(1);
      expect(mockReadJsonFile).toHaveBeenCalledWith({
        filePath: "./package.json",
      });
    });

    it("returns matches=false when manifest version differs from expectedVersion", async () => {
      mockReadJsonFile.mockResolvedValueOnce({
        name: "@vickbk/ci-tools",
        version: "1.2.4",
      });

      const result = await verifyPackageVersion({
        packagePath: "./package.json",
        expectedVersion: "1.2.3",
      });

      expect(result).toEqual({
        currentVersion: "1.2.4",
        expectedVersion: "1.2.3",
        matches: false,
      });
    });
  });

  describe("Package Name Resolution & Error Formatting", () => {
    it("uses explicitly provided packageName in error message when version is missing", async () => {
      mockReadJsonFile.mockResolvedValueOnce({
        name: "manifest-name",
      });

      await expect(
        verifyPackageVersion({
          packagePath: "./node_modules/foo/package.json",
          expectedVersion: "1.0.0",
          packageName: "custom-override-name",
        }),
      ).rejects.toThrow(
        'No "version" field found in custom-override-name at "./node_modules/foo/package.json"',
      );
    });

    it("falls back to manifest.name in error message when packageName is omitted", async () => {
      mockReadJsonFile.mockResolvedValueOnce({
        name: "auto-resolved-package",
      });

      await expect(
        verifyPackageVersion({
          packagePath: "./node_modules/auto-resolved-package/package.json",
          expectedVersion: "1.0.0",
        }),
      ).rejects.toThrow(
        'No "version" field found in auto-resolved-package at "./node_modules/auto-resolved-package/package.json"',
      );
    });

    it("formats error message without package prefix when both packageName and manifest.name are absent", async () => {
      mockReadJsonFile.mockResolvedValueOnce({});

      await expect(
        verifyPackageVersion({
          packagePath: "./package.json",
          expectedVersion: "1.0.0",
        }),
      ).rejects.toThrow('No "version" field found in "./package.json"');
    });

    it("throws error if manifest is empty string or empty version field", async () => {
      mockReadJsonFile.mockResolvedValueOnce({
        name: "empty-ver-pkg",
        version: "",
      });

      await expect(
        verifyPackageVersion({
          packagePath: "./package.json",
          expectedVersion: "1.0.0",
        }),
      ).rejects.toThrow(
        'No "version" field found in empty-ver-pkg at "./package.json"',
      );
    });
  });

  describe("File System & Upstream Edge Cases", () => {
    it("bubbles up file read or JSON parse errors thrown by readJsonFile", async () => {
      const fsError = new Error("ENOENT: no such file or directory");
      mockReadJsonFile.mockRejectedValueOnce(fsError);

      await expect(
        verifyPackageVersion({
          packagePath: "./missing/package.json",
          expectedVersion: "1.0.0",
        }),
      ).rejects.toThrow("ENOENT: no such file or directory");
    });
  });
});

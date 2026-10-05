import { shutConsole } from "#/tests/console";
import { createTextFileAsync, readTextFileAsync } from "@/shared/files";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readCheckedReadmes, saveCheckedReadmes } from "./checked-readmes";
import { CHECKED_READMES_LIST } from "./errors/config";
import type { FileValidationResult } from "./types";

vi.mock("@/shared/files", () => ({
  createTextFileAsync: vi.fn(),
  readTextFileAsync: vi.fn(),
}));

vi.mock("./errors/config", () => ({
  CHECKED_READMES_LIST: "./reports/checked-readmes.md",
}));

describe("saveCheckedReadmes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Markdown Content Serialization", () => {
    it("should correctly format mixed passing and failing validation results", async () => {
      const mockResults: FileValidationResult[] = [
        { path: "README.md", error: undefined },
        { path: "packages/core/README.md", error: new Error("Missing header") },
        { path: "packages/utils/README.md", error: undefined },
      ];

      vi.mocked(createTextFileAsync).mockResolvedValue(undefined as never);

      await saveCheckedReadmes(mockResults);

      const expectedContent = [
        "# Checked Readmes",
        "",
        "(README.md) = ✅",
        "(packages/core/README.md) = ❌",
        "(packages/utils/README.md) = ✅",
        "",
      ].join("\n");

      expect(createTextFileAsync).toHaveBeenCalledTimes(1);
      expect(createTextFileAsync).toHaveBeenCalledWith({
        filePath: "./reports/checked-readmes.md",
        content: expectedContent,
      });
    });

    it("should handle an empty results list gracefully", async () => {
      vi.mocked(createTextFileAsync).mockResolvedValue(undefined as never);

      await saveCheckedReadmes([]);

      const expectedContent = ["# Checked Readmes", "", "", ""].join("\n");

      expect(createTextFileAsync).toHaveBeenCalledOnce();
      expect(createTextFileAsync).toHaveBeenCalledWith({
        filePath: "./reports/checked-readmes.md",
        content: expectedContent,
      });
    });

    it("should mark all results as passing when no errors are present", async () => {
      const mockResults: FileValidationResult[] = [
        { path: "README.md", error: undefined },
        { path: "CONTRIBUTING.md", error: undefined },
      ];

      vi.mocked(createTextFileAsync).mockResolvedValue(undefined as never);

      await saveCheckedReadmes(mockResults);

      const expectedContent = [
        "# Checked Readmes",
        "",
        "(README.md) = ✅",
        "(CONTRIBUTING.md) = ✅",
        "",
      ].join("\n");

      expect(createTextFileAsync).toHaveBeenCalledWith({
        filePath: "./reports/checked-readmes.md",
        content: expectedContent,
      });
    });
  });

  describe("Error Propagation & Failure Modes", () => {
    it("should propagate errors thrown by createTextFileAsync", async () => {
      const mockResults: FileValidationResult[] = [
        { path: "README.md", error: undefined },
      ];

      const fsError = new Error(
        "EACCES: permission denied, open './reports/checked-readmes.md'",
      );
      vi.mocked(createTextFileAsync).mockRejectedValue(fsError);

      await expect(saveCheckedReadmes(mockResults)).rejects.toThrow(fsError);

      expect(createTextFileAsync).toHaveBeenCalledTimes(1);
    });
  });
});

describe("readCheckedReadmes", () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    vi.restoreAllMocks();
    shutConsole();
    vi.spyOn(process, "exit").mockImplementation(
      (code?: string | number | null) => {
        throw new Error(`process.exit called with code: ${code}`);
      },
    );
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it("should successfully read and return the content of the checked readmes file", async () => {
    const mockContent = "# Checked Readmes\n\n(README.md)=✅\n";
    const readSpy = vi.mocked(readTextFileAsync).mockResolvedValue(mockContent);

    const result = await readCheckedReadmes();

    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(readSpy).toHaveBeenCalledWith({ filePath: CHECKED_READMES_LIST });
    expect(result).toBe(mockContent);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("should catch file system errors, log to console.error, and return an empty string when the file cannot be read", async () => {
    const fileError = new Error("ENOENT: no such file or directory");
    const readSpy = vi.mocked(readTextFileAsync).mockRejectedValue(fileError);

    const result = await readCheckedReadmes();

    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(readSpy).toHaveBeenCalledWith({ filePath: CHECKED_READMES_LIST });
    expect(result).toBe("");
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error reading checked readmes from ${CHECKED_READMES_LIST}:`,
      fileError,
    );
  });

  it("should handle non-Error rejections gracefully, log them, and return an empty string", async () => {
    const stringError = "Permission denied string error";
    const readSpy = vi.mocked(readTextFileAsync).mockRejectedValue(stringError);

    const result = await readCheckedReadmes();

    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("");
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error reading checked readmes from ${CHECKED_READMES_LIST}:`,
      stringError,
    );
  });
});

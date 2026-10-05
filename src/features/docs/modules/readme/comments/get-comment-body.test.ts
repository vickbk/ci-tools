import { beforeEach, describe, expect, it, vi } from "vitest";

import { config } from "@/config";
import { readCheckedReadmes } from "../checked-readmes";
import { getErrorLogContent } from "../errors/get-error-log-content";
import {
  getCommentBody,
  SKIPPED_MESSAGE,
  SUCCESS_MESSAGE,
} from "./get-comment-body";

vi.mock("@/config", () => ({
  config: {
    docs: {
      hasRun: true,
    },
  },
}));

vi.mock("../errors/get-error-log-content", () => ({
  getErrorLogContent: vi.fn(),
}));

vi.mock("../checked-readmes", () => ({
  readCheckedReadmes: vi.fn(),
}));

describe("getCommentBody", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    config.docs.hasRun = true;
    vi.mocked(readCheckedReadmes).mockResolvedValue("");
  });

  describe("Exported Constants", () => {
    it("should export the correct SUCCESS_MESSAGE constant", () => {
      expect(SUCCESS_MESSAGE).toBe(
        "✅ Documentation check completed successfully. No issues found.",
      );
    });

    it("should export the correct SKIPPED_MESSAGE constant", () => {
      expect(SKIPPED_MESSAGE).toBe(
        "⚠️ Documentation check did not run. Cannot determine documentation status.",
      );
    });
  });

  describe("When Docs Check Ran (hasRun === true)", () => {
    it("should return just the log content when readCheckedReadmes returns empty string", async () => {
      const mockLogContent = "❌ Missing heading ## Installation in README.md";
      vi.mocked(getErrorLogContent).mockResolvedValue(mockLogContent);
      vi.mocked(readCheckedReadmes).mockResolvedValue("");

      const result = await getCommentBody();

      expect(getErrorLogContent).toHaveBeenCalledTimes(1);
      expect(readCheckedReadmes).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockLogContent);
    });

    it("should prepend checkedList with separator when readCheckedReadmes returns content and log is present", async () => {
      const mockLogContent = "❌ Missing heading ## Installation in README.md";
      const mockCheckedList = "# Checked Readmes\n(README.md)=❌";
      vi.mocked(getErrorLogContent).mockResolvedValue(mockLogContent);
      vi.mocked(readCheckedReadmes).mockResolvedValue(mockCheckedList);

      const result = await getCommentBody();

      expect(result).toBe(`${mockCheckedList}\n\n---\n\n${mockLogContent}`);
    });

    it("should prepend checkedList with separator when readCheckedReadmes returns content and log is null (falling back to SUCCESS_MESSAGE)", async () => {
      const mockCheckedList = "# Checked Readmes\n(README.md)=✅";
      vi.mocked(getErrorLogContent).mockResolvedValue(null);
      vi.mocked(readCheckedReadmes).mockResolvedValue(mockCheckedList);

      const result = await getCommentBody();

      expect(result).toBe(`${mockCheckedList}\n\n---\n\n${SUCCESS_MESSAGE}`);
    });

    it("should return SUCCESS_MESSAGE when getErrorLogContent returns null and checkedList is empty", async () => {
      vi.mocked(getErrorLogContent).mockResolvedValue(null);
      vi.mocked(readCheckedReadmes).mockResolvedValue("");

      const result = await getCommentBody();

      expect(getErrorLogContent).toHaveBeenCalledTimes(1);
      expect(result).toBe(SUCCESS_MESSAGE);
    });

    it("should return empty string log content if log exists as empty string and checkedList is empty", async () => {
      vi.mocked(getErrorLogContent).mockResolvedValue("");
      vi.mocked(readCheckedReadmes).mockResolvedValue("");

      const result = await getCommentBody();

      expect(getErrorLogContent).toHaveBeenCalledTimes(1);
      expect(result).toBe("");
    });
  });

  describe("When Docs Check Did Not Run (hasRun !== true)", () => {
    it("should return SKIPPED_MESSAGE and not check error log or checked list when hasRun is false", async () => {
      config.docs.hasRun = false;

      const result = await getCommentBody();

      expect(getErrorLogContent).not.toHaveBeenCalled();
      expect(readCheckedReadmes).not.toHaveBeenCalled();
      expect(result).toBe(SKIPPED_MESSAGE);
    });

    it("should return SKIPPED_MESSAGE when hasRun is undefined", async () => {
      config.docs.hasRun = undefined as never;

      const result = await getCommentBody();

      expect(getErrorLogContent).not.toHaveBeenCalled();
      expect(readCheckedReadmes).not.toHaveBeenCalled();
      expect(result).toBe(SKIPPED_MESSAGE);
    });

    it("should return SKIPPED_MESSAGE when hasRun is null", async () => {
      config.docs.hasRun = null as never;

      const result = await getCommentBody();

      expect(getErrorLogContent).not.toHaveBeenCalled();
      expect(readCheckedReadmes).not.toHaveBeenCalled();
      expect(result).toBe(SKIPPED_MESSAGE);
    });
  });

  describe("Error Propagation", () => {
    it("should bubble up error when getErrorLogContent rejects", async () => {
      const logError = new Error("[IO Error] Failed to read log file");
      vi.mocked(getErrorLogContent).mockRejectedValue(logError);

      await expect(getCommentBody()).rejects.toThrow(logError);
    });

    it("should bubble up error when readCheckedReadmes rejects if rejection is unhandled", async () => {
      const readError = new Error(
        "[IO Error] Failed to read checked readmes file",
      );
      vi.mocked(getErrorLogContent).mockResolvedValue("Some log");
      vi.mocked(readCheckedReadmes).mockRejectedValue(readError);

      await expect(getCommentBody()).rejects.toThrow(readError);
    });
  });
});

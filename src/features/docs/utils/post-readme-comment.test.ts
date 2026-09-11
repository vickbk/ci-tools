import { beforeEach, describe, expect, it, vi } from "vitest";

import { shutConsole } from "#/tests/console";
import { config } from "@/config";
import { saveComment } from "@/core/github";
import { getErrorLogContent } from "../modules/readme";
import { SKIPPED_MESSAGE, SUCCESS_MESSAGE } from "./get-comment-body";
import {
  postReadmeComment,
  README_COMMENT_IDENTIFIER,
} from "./post-readme-comment";

vi.mock("@/config", () => ({
  config: {
    docs: {
      hasRun: true,
    },
  },
}));

vi.mock("@/core/github", () => ({
  saveComment: vi.fn(),
}));

vi.mock("../modules/readme", () => ({
  getErrorLogContent: vi.fn(),
}));

describe("postReadmeComment", () => {
  const ERROR_LOG_CONTENT =
    "❌ README missing required header: ## Installation";

  beforeEach(() => {
    vi.resetAllMocks();
    shutConsole();

    config.docs.hasRun = true;
  });

  describe("Documentation Check Ran (hasRun === true)", () => {
    it("should save error log content when errors exist", async () => {
      vi.mocked(getErrorLogContent).mockResolvedValue(ERROR_LOG_CONTENT);
      vi.mocked(saveComment).mockResolvedValue({} as never);

      await postReadmeComment();

      expect(getErrorLogContent).toHaveBeenCalledTimes(1);
      expect(saveComment).toHaveBeenCalledWith({
        body: ERROR_LOG_CONTENT,
        identifier: README_COMMENT_IDENTIFIER,
      });
      expect(console.log).toHaveBeenNthCalledWith(
        1,
        "[Readme Reporter] Comment processed successfully.",
      );
    });

    it("should save success message when getErrorLogContent returns null", async () => {
      vi.mocked(getErrorLogContent).mockResolvedValue(null);
      vi.mocked(saveComment).mockResolvedValue({} as never);

      await postReadmeComment();

      expect(saveComment).toHaveBeenCalledWith({
        body: SUCCESS_MESSAGE,
        identifier: README_COMMENT_IDENTIFIER,
      });
    });
  });

  describe("Documentation Check Skipped (hasRun !== true)", () => {
    it("should save skipped message without reading error log when hasRun is false", async () => {
      config.docs.hasRun = false;
      vi.mocked(saveComment).mockResolvedValue({} as never);

      await postReadmeComment();

      expect(getErrorLogContent).not.toHaveBeenCalled();
      expect(saveComment).toHaveBeenCalledWith({
        body: SKIPPED_MESSAGE,
        identifier: README_COMMENT_IDENTIFIER,
      });
    });
  });

  describe("Error Propagation & Failure Modes", () => {
    it("should reject and halt execution if getErrorLogContent throws", async () => {
      const error = new Error("Disk read error");
      vi.mocked(getErrorLogContent).mockRejectedValue(error);

      await expect(postReadmeComment()).rejects.toThrow(error);

      expect(saveComment).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it("should throw error and omit completion log if saveComment fails", async () => {
      vi.mocked(getErrorLogContent).mockResolvedValue(null);

      const saveError = new Error("GitHub API 403 Forbidden");
      vi.mocked(saveComment).mockRejectedValue(saveError);

      await expect(postReadmeComment()).rejects.toThrow(saveError);

      expect(console.log).not.toHaveBeenCalledWith(
        "[Readme Reporter] Comment processed successfully.",
      );
    });
  });
});

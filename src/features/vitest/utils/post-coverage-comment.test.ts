import { shutConsole } from "#/tests/console";
import * as githubApi from "@/core/github";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as vitest from "./post-coverage-comment";
import * as reportUtils from "./report";

describe("postCoverageComment (Runner Entry Point)", () => {
  const mockConfig = {
    token: "ghp_mock_token_12345",
    repository: "octocat/hello-world",
    prNumber: 42,
    runId: "100200300",
  };

  const mockReport = {
    totalPct: "88.5%",
    markdownSummary: "## Coverage Summary",
    commentBody: "\n## 🧪 Test Coverage Report",
  };

  const originalArgv = process.argv;

  beforeEach(() => {
    vi.restoreAllMocks();

    shutConsole();
    vi.spyOn(process, "exit").mockImplementation(
      (code?: string | number | null) => {
        throw new Error(`process.exit called with code: ${code}`);
      },
    );
    vi.spyOn(githubApi, "saveComment");
    vi.spyOn(reportUtils, "getReport");
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  describe("Happy Path Execution", () => {
    const { postCoverageComment } = vitest;

    it("should load configuration, generate report, and save comment", async () => {
      vi.spyOn(githubApi, "getGithubParams").mockReturnValue(mockConfig);
      vi.spyOn(reportUtils, "getReport").mockReturnValue(mockReport);
      const saveCommentSpy = vi
        .spyOn(githubApi, "saveComment")
        .mockResolvedValue({
          id: 555,
          body: mockReport.commentBody,
        } as never);

      await postCoverageComment();

      expect(githubApi.getGithubParams).toHaveBeenCalledTimes(1);
      expect(reportUtils.getReport).toHaveBeenCalledWith(
        undefined,
        "octocat/hello-world",
        "100200300",
      );

      expect(saveCommentSpy).toHaveBeenCalledWith({
        body: mockReport.commentBody,
        identifier: reportUtils.COMMENT_IDENTIFIER,
      });

      expect(console.log).toHaveBeenCalledWith(
        "[Coverage Runner] Comment processed successfully.",
      );
    });
  });

  describe("Error Propagation & Failure Modes", () => {
    const { postCoverageComment } = vitest;

    it("should reject and halt execution if getGithubParams fails", async () => {
      const configError = new Error(
        "Missing GITHUB_TOKEN environment variable",
      );
      vi.spyOn(githubApi, "getGithubParams").mockImplementation(() => {
        throw configError;
      });

      await expect(postCoverageComment()).rejects.toThrow(configError);

      expect(reportUtils.getReport).not.toHaveBeenCalled();
      expect(githubApi.saveComment).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it("should reject and halt execution if getReport fails", async () => {
      vi.spyOn(githubApi, "getGithubParams").mockReturnValue(mockConfig);

      const reportError = new Error("Coverage summary artifact not found");
      vi.spyOn(reportUtils, "getReport").mockImplementation(() => {
        throw reportError;
      });

      await expect(postCoverageComment()).rejects.toThrow(reportError);

      expect(githubApi.saveComment).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it("should reject and omit completion log if saveComment fails", async () => {
      vi.spyOn(githubApi, "getGithubParams").mockReturnValue(mockConfig);
      vi.spyOn(reportUtils, "getReport").mockReturnValue(mockReport);

      const saveError = new Error("GitHub API 500 Internal Server Error");
      vi.spyOn(githubApi, "saveComment").mockRejectedValue(saveError);

      await expect(postCoverageComment()).rejects.toThrow(saveError);

      expect(console.log).not.toHaveBeenCalledWith(
        "[Coverage Runner] Comment processed successfully.",
      );
    });
  });
});

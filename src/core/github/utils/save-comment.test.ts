import { beforeEach, describe, expect, it, vi } from "vitest";

import { shutConsole } from "#/tests/console";
import * as envModule from "../modules/env";
import * as commentModule from "./get-comment-with-id";
import * as headerModule from "./get-headers";
import { saveComment } from "./save-comment";

describe("saveComment", () => {
  const mockConfig = {
    repository: "owner/repo-name",
    prNumber: 42,
    token: "ghp_mock_token_12345",
  };

  const mockHeaders = {
    Authorization: "Bearer ghp_mock_token_12345",
    Accept: "application/vnd.github.v3+json",
  };

  const mockCommentPayload = {
    id: 98765,
    body: "## PR Review Summary",
    user: { login: "github-actions[bot]" },
    created_at: "2026-09-03T12:00:00Z",
    updated_at: "2026-09-03T12:00:00Z",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    shutConsole();

    vi.spyOn(envModule, "getGithubEnv").mockResolvedValue(mockConfig as never);
    vi.spyOn(headerModule, "getHeaders").mockReturnValue(mockHeaders as never);
    vi.spyOn(commentModule, "getCommentWithId").mockResolvedValue(null);
  });

  describe("Comment Creation (POST)", () => {
    it("should send a POST request without identifier prefix when identifier is omitted", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const commentBody = "## Initial PR Comment";
      const result = await saveComment({ body: commentBody, id: null });

      const expectedUrl = `https://api.github.com/repos/${mockConfig.repository}/issues/${mockConfig.prNumber}/comments`;

      expect(envModule.getGithubEnv).toHaveBeenCalledTimes(1);
      expect(headerModule.getHeaders).toHaveBeenCalledWith(mockConfig.token);
      expect(commentModule.getCommentWithId).not.toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        method: "POST",
        headers: mockHeaders,
        body: JSON.stringify({ body: commentBody }),
      });
      expect(result).toEqual(mockCommentPayload);
    });
  });

  describe("Comment Update (PATCH)", () => {
    it("should send a PATCH request to the specific comment endpoint when id is a number", async () => {
      const commentId = 123456;
      const updatedBody = "## Updated PR Comment";
      const updatedPayload = {
        ...mockCommentPayload,
        id: commentId,
        body: updatedBody,
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(updatedPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const result = await saveComment({ body: updatedBody, id: commentId });

      const expectedUrl = `https://api.github.com/repos/${mockConfig.repository}/issues/comments/${commentId}`;

      expect(envModule.getGithubEnv).toHaveBeenCalledTimes(1);
      expect(headerModule.getHeaders).toHaveBeenCalledWith(mockConfig.token);
      expect(commentModule.getCommentWithId).not.toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        method: "PATCH",
        headers: mockHeaders,
        body: JSON.stringify({ body: updatedBody }),
      });
      expect(result).toEqual(updatedPayload);
    });
  });

  describe("Automatic Comment ID Resolution (identifier)", () => {
    it("should resolve comment ID via getCommentWithId and perform PATCH when id is undefined and identifier matches", async () => {
      const existingCommentId = 445566;
      vi.spyOn(commentModule, "getCommentWithId").mockResolvedValueOnce({
        id: existingCommentId,
        body: "\nOld content",
      });

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          ...mockCommentPayload,
          id: existingCommentId,
        }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const identifier = "identifier";
      const commentBody = "## New CI Summary";

      const result = await saveComment({
        body: commentBody,
        identifier,
      });

      const expectedUrl = `https://api.github.com/repos/${mockConfig.repository}/issues/comments/${existingCommentId}`;

      expect(commentModule.getCommentWithId).toHaveBeenCalledWith(identifier);
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        method: "PATCH",
        headers: mockHeaders,
        body: JSON.stringify({
          body: identifier + "\n## New CI Summary",
        }),
      });
      expect(result.id).toBe(existingCommentId);
    });

    it("should perform POST when id is undefined, identifier is provided, but no existing comment is found", async () => {
      vi.spyOn(commentModule, "getCommentWithId").mockResolvedValueOnce(null);

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const identifier = "identifier";
      const commentBody = "## Feature Overview";

      await saveComment({
        body: commentBody,
        identifier,
      });

      const expectedUrl = `https://api.github.com/repos/${mockConfig.repository}/issues/${mockConfig.prNumber}/comments`;

      expect(commentModule.getCommentWithId).toHaveBeenCalledWith(identifier);
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        method: "POST",
        headers: mockHeaders,
        body: JSON.stringify({
          body: identifier + "\n## Feature Overview",
        }),
      });
    });

    it("should NOT call getCommentWithId when id is explicitly provided as null even if identifier is passed", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await saveComment({
        body: "Force new comment",
        id: null,
        identifier: "",
      });

      expect(commentModule.getCommentWithId).not.toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/issues/${mockConfig.prNumber}/comments`),
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("should NOT call getCommentWithId when id is explicitly a number even if identifier is passed", async () => {
      const commentId = 888;
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await saveComment({
        body: "Update existing comment explicitly",
        id: commentId,
        identifier: "",
      });

      expect(commentModule.getCommentWithId).not.toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/issues/comments/${commentId}`),
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    it("should NOT call getCommentWithId when identifier is empty or whitespace-only", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await saveComment({
        body: "Plain body",
        identifier: "   ",
      });

      expect(commentModule.getCommentWithId).not.toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ body: "Plain body" }),
        }),
      );
    });
  });

  describe("Identifier Prepending & Normalization", () => {
    it("should prepend trimmed identifier to body on POST", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const identifier = "  \n";
      const commentBody = "## Documentation Errors";

      await saveComment({
        body: commentBody,
        id: null,
        identifier,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            body: "## Documentation Errors",
          }),
        }),
      );
    });

    it("should trim surrounding whitespace from identifier before prepending on PATCH", async () => {
      const commentId = 555;
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const identifier = "  \n\n ";
      const commentBody = "## Coverage Report";

      await saveComment({
        body: commentBody,
        id: commentId,
        identifier,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            body: "## Coverage Report",
          }),
        }),
      );
    });

    it("should treat empty string identifier identical to default parameter", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockCommentPayload),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const commentBody = "Plain comment body";

      await saveComment({
        body: commentBody,
        id: null,
        identifier: "",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ body: "Plain comment body" }),
        }),
      );
    });
  });

  describe("API Error Handling", () => {
    it("should log error text and throw appropriate error message on POST failure", async () => {
      const responseText = `{"message": "Validation Failed"}`;
      const mockResponse = {
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        text: vi.fn().mockResolvedValue(responseText),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await expect(
        saveComment({ body: "Test Body", id: null }),
      ).rejects.toThrow(
        "[GitHub API] Failed to post comment: HTTP 422 Unprocessable Entity",
      );

      expect(console.log).toHaveBeenCalledWith(
        `[CGithub API] Failed to post comment: ${responseText}`,
      );
    });

    it("should log error text and throw appropriate error message on PATCH failure", async () => {
      const commentId = 789;
      const responseText = `{"message": "Not Found"}`;
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: vi.fn().mockResolvedValue(responseText),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      await expect(
        saveComment({ body: "Test Body", id: commentId }),
      ).rejects.toThrow(
        "[GitHub API] Failed to edit comment: HTTP 404 Not Found",
      );

      expect(console.log).toHaveBeenCalledWith(
        `[CGithub API] Failed to edit comment: ${responseText}`,
      );
    });
  });

  describe("Upstream & Network Failures", () => {
    it("should bubble up error when getGithubEnv fails", async () => {
      const envError = new Error(
        "[GithubEnv] Missing required environment variables",
      );
      vi.spyOn(envModule, "getGithubEnv").mockRejectedValue(envError);

      await expect(
        saveComment({ body: "Test Body", id: null }),
      ).rejects.toThrow(envError);

      expect(fetch).not.toHaveBeenCalled();
    });

    it("should bubble up error when getCommentWithId rejects during resolution", async () => {
      const resolutionError = new Error(
        "GitHub search API rate limit exceeded",
      );
      vi.spyOn(commentModule, "getCommentWithId").mockRejectedValue(
        resolutionError,
      );

      await expect(
        saveComment({
          body: "Test Body",
          identifier: "identifier",
        }),
      ).rejects.toThrow(resolutionError);

      expect(fetch).not.toHaveBeenCalled();
    });

    it("should bubble up network rejection from fetch", async () => {
      const networkError = new TypeError("Failed to fetch");
      vi.mocked(fetch).mockRejectedValue(networkError);

      await expect(
        saveComment({ body: "Test Body", id: null }),
      ).rejects.toThrow(networkError);
    });
  });
});

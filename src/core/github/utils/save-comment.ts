import { getGithubEnv } from "../modules/env";
import { GitHubComment } from "../types";
import { getCommentWithId } from "./get-comment-with-id";
import { getHeaders } from "./get-headers";

/**
 * Creates or updates a pull-request comment via the GitHub Issues API.
 *
 * @param options - Options object for saving a pull-request comment.
 * @param options.body - The markdown body to post or patch into the PR discussion.
 * @param options.id - Optional existing comment ID when updating or null if not exist.
 * @param options.identifier - Optional identifier tag prepended to the comment body for auto-resolution.
 *
 * @returns The created or patched GitHub comment response payload.
 * @throws {Error} When the GitHub API response is unsuccessful.
 */
export async function saveComment({
  body,
  id,
  identifier = "",
}: {
  body: string;
  /**
   * @deprecated Use `identifier` alone to resolve comment IDs automatically.
   * Will be removed in the next major version.
   */
  id?: number | null;
  identifier?: string;
}): Promise<GitHubComment> {
  const { repository, token, prNumber } = await getGithubEnv();

  const trimmedIdentifier = identifier.trim();

  const commentId =
    id ??
    (id === undefined && trimmedIdentifier !== ""
      ? ((await getCommentWithId(trimmedIdentifier))?.id ?? null)
      : null);

  const isPost = commentId === null;

  const url = isPost
    ? `https://api.github.com/repos/${repository}/issues/${prNumber}/comments`
    : `https://api.github.com/repos/${repository}/issues/comments/${commentId}`;

  const formattedBody = trimmedIdentifier
    ? `${trimmedIdentifier}\n${body}`
    : body;

  const response = await fetch(url, {
    method: isPost ? "POST" : "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ body: formattedBody }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log(
      `[CGithub API] Failed to ${isPost ? "post" : "edit"} comment: ${errorText}`,
    );
    throw new Error(
      `[GitHub API] Failed to ${isPost ? "post" : "edit"} comment: HTTP ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as GitHubComment;
}

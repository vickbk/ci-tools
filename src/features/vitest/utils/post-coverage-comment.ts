import { getGithubParams, saveComment } from "@/core/github";
import { COMMENT_IDENTIFIER, getReport } from "./report";

/**
 * Posts a new or updates an existing sticky GitHub pull-request coverage comment for the current workflow run.
 *
 * @returns Promise<void> - Resolves after the coverage comment is created or patched.
 * @throws {Error} When the required GitHub workflow metadata or report data cannot be loaded.
 */
export async function postCoverageComment() {
  const config = getGithubParams();
  const report = getReport(undefined, config.repository, config.runId);

  await saveComment({
    body: report.commentBody,
    identifier: COMMENT_IDENTIFIER,
  });

  console.log("[Coverage Runner] Comment processed successfully.");
}

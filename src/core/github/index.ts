/**
 * GitHub Actions environment, REST API, and workflow-output utilities.
 *
 * @example
 * ```ts
 * import { getGithubParams, writeStepSummary } from "@vickbk/ci-tools/github";
 *
 * const params = getGithubParams();
 * writeStepSummary(`Run ${params.runId} completed.`);
 * ```
 */
/** Reads and validates GitHub Actions workflow environment data. */
export { getGithubEnv } from "./modules/env";
/** Shape of validated GitHub Actions environment data. */
export type { GithubEnvData } from "./modules/env";
/** GitHub API request, comment, and workflow payload types. */
export type * from "./types";
/** Finds an existing pull-request comment by stable identifier. */
export { getCommentWithId } from "./utils/get-comment-with-id";
/** Reads pull-request workflow parameters from the event context. */
export { getGithubParams } from "./utils/get-github-params";
/** Persists key/value pairs to the GitHub Actions environment file. */
export { githubWriteEnv } from "./utils/github-write-env";
/** Creates or updates a pull-request comment through the GitHub API. */
export { saveComment } from "./utils/save-comment";
/** Appends markdown content to the GitHub Actions step summary. */
export { writeStepSummary } from "./utils/write-step-summary";

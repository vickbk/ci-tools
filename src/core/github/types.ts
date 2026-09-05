/**
 * GitHub issue comment payload returned by the REST API.
 */
export type GitHubComment = {
  /** GitHub comment identifier. */
  id: number;
  /** Markdown body returned by GitHub. */
  body: string;
};

/**
 * Repository and auth metadata required for pull-request comment operations.
 */
export type ApiConfig = {
  /** GitHub authentication token. */
  token: string;
  /** Repository slug in `owner/name` form. */
  repository: string;
  /** Pull-request number associated with the workflow. */
  prNumber: number;
};

/**
 * Runtime data loaded from the current GitHub Actions event and environment.
 */
export type GithubParams = {
  /** GitHub authentication token. */
  token: string;
  /** Repository slug in `owner/name` form. */
  repository: string;
  /** Pull-request number associated with the workflow. */
  prNumber: number;
  /** Optional GitHub Actions run identifier. */
  runId?: string;
};

/** Subset of a GitHub event payload needed to resolve a pull request. */
export type GithubEnvData = {
  /** Pull-request event data, when the workflow was triggered for a pull request. */
  pull_request?: {
    /** Numeric identifier of the pull request. */
    number: number;
  };
};

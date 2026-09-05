import { config } from "@/config";

/**
 * Reads the minimum GitHub Actions environment required by API helpers.
 *
 * @returns The configured token, repository, event path, and workflow metadata.
 * @throws {Error} When `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, or `GITHUB_EVENT_PATH` is missing.
 */
export function getGithubRequireds() {
  const { token, repository, eventPath } = config.github;

  if (!token || !repository || !eventPath) {
    throw new Error(
      "[GithubEnv] Missing required environment variables (GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_EVENT_PATH).",
    );
  }

  return { ...config.github, token, repository, eventPath };
}

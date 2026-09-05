import { readJsonFile } from "@/shared/files";
import { GithubEnvData } from "../types";
import { getGithubRequireds } from "./get-github-requireds";

/**
 * Loads GitHub Actions environment data and resolves the active pull request.
 *
 * @returns A promise containing validated workflow parameters and pull-request number.
 * @throws {Error} When required workflow variables are missing or the event is not a pull request.
 */
export async function getGithubEnv() {
  const params = getGithubRequireds();

  const { pull_request } = await readJsonFile<GithubEnvData>({
    filePath: params.eventPath,
  });

  const prNumber = pull_request?.number;
  if (!prNumber) {
    throw new Error(
      "[GithubEnv] Event payload is not associated with a Pull Request.",
    );
  }
  return { ...params, prNumber };
}

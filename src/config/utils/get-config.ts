import { Config } from "../types";
import { configSchema } from "./config-schema";

let cachedConfig: Config | null = null;

export type ConfigInput = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
};

/**
 * Clears the memoized configuration so tests and isolated execution contexts can re-resolve environment values.
 *
 * @returns void - Resets the cached config singleton.
 */
export const resetConfig = (): void => {
  cachedConfig = null;
};

/**
 * Reads the current process environment, validates it against the workflow schema, and returns a cached config object.
 *
 * @returns The resolved workflow configuration for GitHub Actions metadata, file paths, and runtime flags.
 * @throws {Error} When required configuration values are invalid or fail schema validation.
 */
export const getConfig = (input: ConfigInput = {}): Config => {
  if (cachedConfig) return cachedConfig;

  const environment = input.env ?? process.env;
  const cwd = input.cwd ?? process.cwd();

  const parsed = configSchema.safeParse({
    cwd,
    isCI: environment.CI,
    github: {
      stepSummaryPath: environment.GITHUB_STEP_SUMMARY,
      envPath: environment.GITHUB_ENV,
      refName: environment.GITHUB_REF_NAME || environment.RELEASE_VERSION,
      token: environment.GITHUB_TOKEN,
      repository: environment.GITHUB_REPOSITORY,
      eventPath: environment.GITHUB_EVENT_PATH,
      runId: environment.GITHUB_RUN_ID,
      stepSummaryFile: environment.GITHUB_STEP_SUMMARY,
    },
    paths: {
      vitestReport: environment.COVERAGE_PATH,
      changelog: environment.CHANGELOG_PATH,
      releaseChangelog: environment.RELEASE_CHANGELOG_PATH,
      package: environment.PACKAGE,
    },
    docs: {
      hasRun: environment.DOCS_RUN_OUTCOME,
    },
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Environment validation failed: ${errorMessages}`);
  }

  cachedConfig = parsed.data;
  return cachedConfig;
};

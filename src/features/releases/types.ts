/**
 * Optional input values for release note extraction.
 */
export type ExtractReleaseNotesOptions = {
  versionTag?: string;
  changelogPath?: string;
  outputPath?: string;
};

/** Normalized release version and npm publication metadata. */
export type ReleaseTypeResult = {
  /** Version string without prerelease metadata. */
  normalized: string;
  /** Stable release version portion. */
  version: string;
  /** Whether the version is a prerelease. */
  IS_PRERELEASE: boolean;
  /** npm dist-tag selected for publication. */
  releaseTag: string;
};

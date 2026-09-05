/**
 * Release metadata, changelog extraction, and npm dist-tag utilities.
 *
 * @example
 * ```ts
 * import { extractReleaseNotes } from "@vickbk/ci-tools/releases";
 *
 * extractReleaseNotes({ versionTag: "1.2.3" });
 * ```
 */
/** Options and result shapes used by release helpers. */
export type { ExtractReleaseNotesOptions, ReleaseTypeResult } from "./types";
/** Extracts the requested release section from CHANGELOG.md. */
export { extractReleaseNotes } from "./utils/extract-note";
/** Resolves and writes the npm dist-tag for the current release. */
export { writeDistTagToGithubOutput } from "./utils/write-dist-tag";

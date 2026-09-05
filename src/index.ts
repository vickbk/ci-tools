/**
 * Root SDK surface combining core, documentation, GitHub, release, and
 * Vitest coverage utilities.
 *
 * @example
 * ```ts
 * import { extractReleaseNotes } from "@vickbk/ci-tools";
 *
 * extractReleaseNotes({ versionTag: "1.2.3" });
 * ```
 */
export * from "./core";
/** Public README contract validation and reporting utilities. */
export * from "./features/docs";
/** Public GitHub Actions environment and comment utilities. */
export * from "./core/github";
/** Public release metadata and changelog utilities. */
export * from "./features/releases";
/** Public Vitest coverage reporting utilities. */
export * from "./features/vitest";

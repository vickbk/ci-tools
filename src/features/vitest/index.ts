/**
 * Vitest coverage summary and pull-request comment utilities.
 *
 * @example
 * ```ts
 * import { generateCoverageSummary } from "@vickbk/ci-tools/vitest";
 *
 * generateCoverageSummary();
 * ```
 */
/** Coverage metric, report, and JSON input contracts. */
export type {
  CoverageMetric,
  CoverageReport,
  CoverageSummaryJson,
} from "./types";
/** Generates workflow summary output and exports total coverage. */
export { generateCoverageSummary } from "./utils/generate-coverage-summary";
/** Creates or updates the sticky pull-request coverage comment. */
export { postCoverageComment } from "./utils/post-coverage-comment";

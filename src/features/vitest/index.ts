/**
 * Re-exports the Vitest coverage summary and pull-request comment automation entry points.
 */
export type {
  CoverageMetric,
  CoverageReport,
  CoverageSummaryJson,
} from "./types";
export { generateCoverageSummary } from "./utils/generate-coverage-summary";
export { postCoverageComment } from "./utils/post-coverage-comment";

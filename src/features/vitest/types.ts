/**
 * Coverage metric populated by the generated Vitest JSON summary.
 */
export type CoverageMetric = {
  /** Total number of measurable items. */
  total: number;
  /** Number of items covered by tests. */
  covered: number;
  /** Number of items skipped by the coverage provider. */
  skipped: number;
  /** Coverage percentage reported by Vitest. */
  pct: number;
};

/**
 * Raw Vitest JSON summary structure read from coverage-summary.json.
 */
export type CoverageSummaryJson = {
  /** Aggregate coverage metrics grouped by source category. */
  total: {
    /** Line coverage metric. */
    lines: CoverageMetric;
    /** Statement coverage metric. */
    statements: CoverageMetric;
    /** Function coverage metric. */
    functions: CoverageMetric;
    /** Branch coverage metric. */
    branches: CoverageMetric;
  };
};

/**
 * Final markdown and comment payloads generated for GitHub Actions reporting.
 */
export type CoverageReport = {
  /** Formatted total statement coverage percentage. */
  totalPct: string;
  /** Markdown body used for the pull-request comment. */
  commentBody: string;
  /** Markdown body used for the workflow step summary. */
  markdownSummary: string;
};

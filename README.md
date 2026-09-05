# @vickbk/ci-tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@vickbk/ci-tools.svg)](https://www.npmjs.com/package/@vickbk/ci-tools)
[![Build Status](https://img.shields.io/github/actions/workflow/status/vickbk/ci-tools/lint-test-docs.yml?branch=main)](https://github.com/vickbk/ci-tools/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/vickbk/ci-tools)

Programmatic CI utilities for documentation contracts, release metadata,
GitHub Actions integration, and Vitest coverage reporting.

## Overview

`@vickbk/ci-tools` provides small, composable helpers for CI repositories. The
package keeps domain logic reusable while leaving workflow-specific orchestration
and process lifecycle decisions to the consuming repository.

Key benefits:

- **Modular and tree-shakable**: import only the `/core`, `/docs`, `/github`,
  `/releases`, or `/vitest` surface you need.
- **Dual ESM and CommonJS**: consume modern `.mjs` or legacy `.cjs` bundles with
  matching `.d.mts` and `.d.cts` declarations.
- **Automated PR feedback**: reuse sticky-comment helpers for Vitest coverage,
  README drift, and custom workflow bots.
- **CI utility toolkit**: use zero-dependency file and path helpers for reliable
  pipeline input and output handling.

## Quick Start

Install the package and run a README contract check from a workflow script:

```bash
pnpm add -D @vickbk/ci-tools
```

```ts
import { checkReadmeFiles } from "@vickbk/ci-tools/docs";
import { rootReadmeContract } from "./readme-contract";

const result = await checkReadmeFiles({ "./README.md": rootReadmeContract });
console.log(result.every(({ result }) => result?.isValid));
```

## Installation

```bash
pnpm add -D @vickbk/ci-tools
```

## Subpath Exports

| Import path                 | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `@vickbk/ci-tools/core`     | Error handling and shared workflow primitives  |
| `@vickbk/ci-tools/docs`     | README contract validation and reporting       |
| `@vickbk/ci-tools/github`   | GitHub Actions environment and comment helpers |
| `@vickbk/ci-tools/releases` | Release notes and npm dist-tag helpers         |
| `@vickbk/ci-tools/vitest`   | Coverage summaries and pull-request comments   |

## Usage

The subpaths are independently importable from ESM TypeScript or JavaScript.
For executable workflow scripts, wrap process-aware work with `runTask`:

```ts
import { runTask } from "@vickbk/ci-tools/core";

await runTask("validate", async () => {
  await validateRepository();
});
```

### Mirroring a `src/bin` CLI Script

`runTask` selects a CLI task by matching the script name in `process.argv[1]`.
Add the executable to `package.json`, then wrap its callback with the selector
and a formatter for fatal errors:

```json
{
  "scripts": {
    "readme-check": "tsx ./src/bin/documentation/readme-check.ts"
  }
}
```

```ts
// src/bin/documentation/readme-check.ts
import { runTask } from "@vickbk/ci-tools/core";
import { checkReadmeFiles, handleReadmeCliError } from "@vickbk/ci-tools/docs";

await runTask(
  "readme-check",
  async () => {
    await checkReadmeFiles(readmeContracts);
  },
  handleReadmeCliError,
);
```

Run it with `pnpm readme-check`. The selector (`"readme-check"`), callback,
and error prefix or formatter are the three `runTask` arguments; the helper
returns without running when another bin script invokes the module.

## Programmatic API Examples

### GitHub Actions

`getGithubParams` reads pull-request context from the configured event payload;
`getGithubEnv` provides the same context asynchronously. Compose
`getCommentWithId` and `saveComment` for a sticky PR comment. These are the
package's equivalents of a higher-level `parseGithubEnvData` or
`postOrUpdateComment` helper.

```ts
import {
  getCommentWithId,
  getGithubEnv,
  getGithubParams,
  saveComment,
} from "@vickbk/ci-tools/github";

const params = getGithubParams();
const env = await getGithubEnv();
const identifier = "<!-- ci-tools-status -->";
const existing = await getCommentWithId(identifier);

await saveComment({
  id: existing?.id ?? null,
  identifier,
  body: `Checks for ${env.repository} PR #${params.prNumber} are complete.`,
});
```

### Vitest Coverage

`generateCoverageSummary` reads the configured `coverage-summary.json`, writes
the workflow summary, and exports `TOTAL_PCT`. `postCoverageComment` generates
or updates the sticky coverage comment. The low-level report parser is kept
internal so consumers can use the stable workflow-facing functions.

```ts
import {
  generateCoverageSummary,
  postCoverageComment,
} from "@vickbk/ci-tools/vitest";

generateCoverageSummary("coverage/coverage-summary.json");
await postCoverageComment();
```

### Documentation Contracts

Use `checkReadmeFiles` with a path-to-contract map and call `postReadmeComment`
after the check in a GitHub Actions job. The checker throws an `AggregateError`
when one or more targets fail, while the comment helper formats the stored
success, skipped, or diagnostic result.

```ts
import { checkReadmeFiles, postReadmeComment } from "@vickbk/ci-tools/docs";
import type { DocumentationContract } from "@vickbk/ci-tools/docs";
import { rootReadmeContract } from "./readme-contract";

const contracts: Record<string, DocumentationContract> = {
  "./README.md": rootReadmeContract,
};

try {
  await checkReadmeFiles(contracts);
} finally {
  await postReadmeComment();
}
```

### Release Notes

Extract a versioned Markdown section directly from `CHANGELOG.md` and receive
the generated output path:

```ts
import { extractReleaseNotes } from "@vickbk/ci-tools/releases";

const releaseNotesPath = extractReleaseNotes({ versionTag: "0.1.0" });
console.log(`Release notes written to ${releaseNotesPath}`);
```

## Custom Helpers

The GitHub primitives make small repository-specific bots easy to keep local.
This complete helper posts a welcome message once and updates it on later runs
while counting the current pull request's workflow visits:

```ts
import {
  getCommentWithId,
  getGithubParams,
  saveComment,
} from "@vickbk/ci-tools/github";

const identifier = "<!-- ci-tools-welcome -->";

export async function postWelcomeComment(): Promise<void> {
  const { repository, prNumber } = getGithubParams();
  const existing = await getCommentWithId(identifier);
  const visits = existing
    ? Number(existing.body.match(/Visits: (\d+)/)?.[1] ?? 0) + 1
    : 1;

  await saveComment({
    id: existing?.id ?? null,
    identifier,
    body: [
      `Welcome to ${repository} PR #${prNumber}!`,
      `Visits: ${visits}`,
      "This message is managed by the repository CI bot.",
    ].join("\n"),
  });
}
```

## Architecture

The public package is SDK-oriented. The `core`, `docs`, `github`, `releases`,
and `vitest` entrypoints contain reusable functions and types. The repository's
`src/bin` scripts remain process-aware adapters for CI execution.

## License

MIT

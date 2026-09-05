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

The subpaths are independently importable from ESM TypeScript or JavaScript:

```ts
import { checkReadmeFiles } from "@vickbk/ci-tools/docs";
import { getGithubParams } from "@vickbk/ci-tools/github";
import { extractReleaseNotes } from "@vickbk/ci-tools/releases";
import { generateCoverageSummary } from "@vickbk/ci-tools/vitest";

await checkReadmeFiles({});
const github = getGithubParams();
const notes = extractReleaseNotes({ versionTag: "1.2.3" });
generateCoverageSummary();
console.log({ github, notes });
```

The core entrypoint exposes process-aware task orchestration for repository
scripts:

```ts
import { runTask } from "@vickbk/ci-tools/core";
import { checkReadmeFiles } from "@vickbk/ci-tools/docs";
import { readmeContract } from "./readme-contract.ts";

await runTask(
  "validate",
  async () => {
    await checkReadmeFiles({ "./README.md": readmeContract });
  },
  "❌ [Fatal Error]", // A prefix to know which error is occuring
);
```

## Architecture

The public package is SDK-oriented. The `core`, `docs`, `github`, `releases`,
and `vitest` entrypoints contain reusable functions and types. The repository's
`src/bin` scripts remain process-aware adapters for CI execution.

## License

MIT

# @vickbk/ci-tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@vickbk/ci-tools.svg)](https://www.npmjs.com/package/@vickbk/ci-tools)
[![Build Status](https://img.shields.io/github/actions/workflow/status/vickbk/ci-tools/lint-test-docs.yml?branch=main)](https://github.com/vickbk/ci-tools/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/vickbk/ci-tools)

Programmatic CI utilities for documentation contracts, release metadata,
GitHub Actions integration, and Vitest coverage reporting.

## Overview

`@vickbk/ci-tools` gives TypeScript projects small, composable building blocks
for reliable GitHub Actions workflows. Use the feature modules independently,
or combine them behind a repository-specific task entrypoint.

## Features & Value Proposition

- 📊 **Vitest PR Coverage Comments**: Parse `coverage-summary.json` and post
  sticky, auto-updating coverage reports to pull requests.
- 📜 **Documentation Contracts**: Enforce required headings and structural
  rules across repository `README.md` files in CI.
- 💬 **Sticky GitHub Comments**: Idempotently create, update, or remove
  workflow status comments without spamming PR threads.
- 📦 **Release Automation**: Extract clean Markdown release notes from
  `CHANGELOG.md` for GitHub Releases and npm deployments.

## Installation

```bash
pnpm add -D @vickbk/ci-tools
```

## Workflow Setup & Task Orchestration

Put repository-specific orchestration in a small executable and use `runTask`
as its process-aware adapter. This keeps feature helpers reusable while giving
the CI entrypoint a predictable error boundary.

### Add the workflow step

```yaml
- name: Verify Documentation Contracts
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: pnpm enforce-rules
```

### Define the package script

```json
{
  "scripts": {
    "enforce-rules": "tsx scripts/enforce-rules.ts"
  }
}
```

### Implement the task with `runTask`

```ts
import { runTask } from "@vickbk/ci-tools/core";
import { checkReadmeFiles, postReadmeComment } from "@vickbk/ci-tools/docs";
import { rootReadmeContract } from "../readme-contract";

const readmeContracts = { "./README.md": rootReadmeContract };

await runTask("enforce-rules", async () => {
  try {
    await checkReadmeFiles(readmeContracts);
  } finally {
    await postReadmeComment();
  }
});
```

## Standalone Module Examples

Each subpath can be imported directly from ESM TypeScript or JavaScript.

### Vitest Coverage (`@vickbk/ci-tools/vitest`)

Generate the workflow summary and create or update the sticky pull-request
coverage comment:

```ts
import {
  generateCoverageSummary,
  postCoverageComment,
} from "@vickbk/ci-tools/vitest";

generateCoverageSummary("coverage/coverage-summary.json");
await postCoverageComment();
```

[📖 Read more in the Vitest Module README](src/features/vitest/README.md)

### Documentation Contracts (`@vickbk/ci-tools/docs`)

Define a contract map and validate the repository README files:

```ts
import { checkReadmeFiles } from "@vickbk/ci-tools/docs";
import type { DocumentationContract } from "@vickbk/ci-tools/docs";

const contract: DocumentationContract = {
  packageName: "my-project",
  sections: [
    { id: "identity", heading: "my-project", required: true },
    { id: "usage", heading: "Usage", required: true },
  ],
  preferredSectionOrder: ["identity", "usage"],
  requiredSectionIds: ["identity", "usage"],
  recommendedSectionIds: [],
};

const results = await checkReadmeFiles({ "./README.md": contract });
console.log(results.every(({ result }) => result?.isValid));
```

[📖 Read more in the Docs Module README](src/features/docs/README.md)

### GitHub PR Primitives (`@vickbk/ci-tools/github`)

Create or update a sticky custom status comment using a stable identifier:

```ts
import {
  getCommentWithId,
  getGithubParams,
  saveComment,
} from "@vickbk/ci-tools/github";

const identifier = "<!-- ci-tools-status -->";
const { repository, prNumber } = getGithubParams();
const existing = await getCommentWithId(identifier);

await saveComment({
  id: existing?.id ?? null,
  identifier,
  body: `Checks for ${repository} PR #${prNumber} are complete.`,
});
```

[📖 Read more in the GitHub Module README](src/core/github/README.md)

### Release Automation (`@vickbk/ci-tools/releases`)

Extract a versioned Markdown section from `CHANGELOG.md` into a release-note
file:

```ts
import { extractReleaseNotes } from "@vickbk/ci-tools/releases";

const releaseNotesPath = extractReleaseNotes({ versionTag: "0.1.0" });
console.log(`Release notes written to ${releaseNotesPath}`);
```

[📖 Read more in the Releases Module README](src/features/releases/README.md)

### Core Primitives (`@vickbk/ci-tools/core`)

The core entrypoint provides process-aware task orchestration through `runTask`
plus shared error, file, and workflow utility surfaces used by the feature
modules.

[📖 Read more in the Core Module README](src/core/README.md)

## Environment Variables

GitHub Actions workflows using GitHub-backed helpers provide these standard
context variables:

| Variable            | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `GITHUB_TOKEN`      | Token used for GitHub API requests and PR comments.      |
| `GITHUB_EVENT_PATH` | Path to the event JSON containing pull-request metadata. |
| `GITHUB_REPOSITORY` | Repository identifier in `owner/name` format.            |

## Subpath Export Reference

| Import path                 | Primary capabilities                          |
| --------------------------- | --------------------------------------------- |
| `@vickbk/ci-tools/core`     | Task orchestration and shared error utilities |
| `@vickbk/ci-tools/docs`     | README contract validation and reporting      |
| `@vickbk/ci-tools/github`   | GitHub Actions context and sticky comments    |
| `@vickbk/ci-tools/releases` | Changelog extraction and npm release metadata |
| `@vickbk/ci-tools/vitest`   | Coverage summaries and pull-request comments  |

## License

MIT

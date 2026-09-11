# @vickbk/ci-tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@vickbk/ci-tools.svg)](https://www.npmjs.com/package/@vickbk/ci-tools)
[![Build Status](https://img.shields.io/github/actions/workflow/status/vickbk/ci-tools/lint-test-docs.yml?branch=main)](https://github.com/vickbk/ci-tools/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/vickbk/ci-tools)

Programmatic CI utilities for documentation contracts, release metadata,
GitHub Actions integration, and Vitest coverage reporting.

## Overview

`@vickbk/ci-tools` provides zero-dependency, composable workflow utilities for GitHub Actions integration, PR coverage reporting, documentation contract checks, and automated releases.


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
    "enforce-rules": "tsx scripts/pr-rules-helper.ts"
  }
}
```

### Task Orchestration with `runTask`

The `runTask` utility provides a lightweight selector for CLI scripts and workflow entrypoints. It matches the task name passed in `process.argv` and executes the corresponding callback.

#### Core Principles
* **Natural CI Failure**: `runTask` does not catch or swallow errors. When a helper throws an error, it bubbles up naturally to fail the CI workflow step.
* **Single Responsibility**: Keep workflow steps isolated—run policy updates, contract checks, and coverage reports in dedicated tasks.
* **Optional Error Formatting**: Pass an optional error prefix or error formatter as the third argument to log clean, user-friendly CLI messages before process exit.

---

#### 1. Define the PR Rule Helper (`scripts/pr-rules.ts`)

```ts
import { getCommentWithId, saveComment } from "@vickbk/ci-tools/github";

const PR_RULES_IDENTIFIER = "<!-- ci-tools-pr-rules -->";

export async function prRuleComment(): Promise<void> {
  const existing = await getCommentWithId(PR_RULES_IDENTIFIER);

  await saveComment({
    id: existing?.id ?? null,
    identifier: PR_RULES_IDENTIFIER,
    body: [
      PR_RULES_IDENTIFIER,
      "### 📋 Pull Request Requirements",
      "- [ ] All commits must be signed and follow conventional commits.",
      "- [ ] Vitest coverage must satisfy minimum repository thresholds.",
      "- [ ] Documentation contracts must pass without drift.",
    ].join("\n"),
  });

  console.log("Successfully posted PR rules comment.");
}
```

#### 2. Wrap with `runTask`

```ts
// scripts/pr-rules.ts
import { runTask } from "@vickbk/ci-tools/core";
import { prRuleComment } from "./pr-rules-helper";

await runTask(
  "pr-rules",
  async () => {
    await prRuleComment();
  },
  (error) => `[PR Rules Failure] ${error.message}`
);
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

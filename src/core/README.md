# @vickbk/ci-tools/core

## Overview

The core entrypoint provides shared error utilities and the task runner used to
orchestrate process-aware repository scripts.

## Key modules

| Module            | Purpose                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `runTask`         | Runs an async task and delegates failures to the configured fatal-error handler. |
| `getErrorMessage` | Normalizes unknown thrown values into readable messages.                         |
| `github`          | Re-exports the GitHub workflow helpers used by the package.                      |

## Usage example

```ts
import { runTask } from "@vickbk/ci-tools/core";

await runTask("generate-report", async () => {
  await generateReport();
});
```

## Error strategy

Use `runTask` at executable workflow boundaries. Keep reusable library helpers
free of process exits; the runner catches failures and delegates fatal handling
to the CLI boundary so consumers can choose their own reporting policy.

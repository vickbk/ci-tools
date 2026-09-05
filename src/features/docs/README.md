# @vickbk/ci-tools/docs

## Overview

The docs entrypoint validates repository README files against explicit
`DocumentationContract` definitions and exposes the resulting diagnostics.

## Features

- Validate required README sections and their preferred order.
- Match headings to stable section identifiers.
- Aggregate validation results across multiple README targets.
- Post validation results as repository workflow comments when needed.

## Usage

```bash
pnpm add -D @vickbk/ci-tools
```

```ts
import { checkReadmeFiles } from "@vickbk/ci-tools/docs";

const results = await checkReadmeFiles({
  "./README.md": rootContract,
});
console.log(results);
```

Public entrypoints include `checkReadmeFiles`, `postReadmeComment`,
`DocumentationContract`, and the README validation result types.

## Validation rules

Each target contract defines section identifiers, expected headings, required
sections, and preferred ordering. The validator ignores headings inside fenced
code blocks and reports missing sections or ordering violations with file and
section diagnostics.

## License

MIT

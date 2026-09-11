# Package Verification Module

The `@vickbk/ci-tools/packages` module provides specialized utilities for inspecting, validating, and asserting package manifest metadata across build scripts, CI pipelines, and setup workflows.

## Overview

In multi-package repositories and automated release pipelines, ensuring that dependencies or local workspace packages match target version expectations is critical to prevent silent version drift or obsolete code workarounds.

This module exposes setup-first, single-responsibility utilities for parsing manifest files (`package.json`), asserting semantic version alignment, and producing clear diagnostic error logs when version constraints fail.

## API Reference

All exports are accessible via the `@vickbk/ci-tools/packages` subpath.

### Public Entrypoints

#### `verifyPackageVersion(options)`

Reads a JSON manifest file from disk and checks if its `"version"` string strictly equals an expected version string.

```ts
function verifyPackageVersion(
  options: VerifyPackageOptions,
): Promise<VerifyPackageResult>;
```

````

#### Exported Types

- **`VerifyPackageOptions`**: Input configuration object.
- `packagePath` (`string`): Relative or absolute path to the target `package.json`.
- `expectedVersion` (`string`): The target semantic version expected by the caller.
- `packageName` (`string`, optional): Custom label for error diagnostics. If omitted, automatically resolves to the manifest's `"name"` field.

- **`VerifyPackageResult`**: Result of the version comparison.
- `currentVersion` (`string`): Version string extracted from the manifest.
- `expectedVersion` (`string`): Target version passed in options.
- `matches` (`boolean`): `true` if `currentVersion === expectedVersion`, otherwise `false`.

- **`PackageManifest`**: Type schema representing expected `package.json` fields (`name?`, `version?`).

## Usage Examples

### Basic Version Verification

Assert that a workspace package matches an expected target version:

```ts
import { verifyPackageVersion } from "@vickbk/ci-tools/packages";

const { matches, currentVersion, expectedVersion } = await verifyPackageVersion(
  {
    packagePath: "./packages/core/package.json",
    expectedVersion: "1.2.0",
  },
);

if (!matches) {
  console.error(
    `Version drift detected! Found ${currentVersion}, expected ${expectedVersion}`,
  );
  process.exit(1);
}
```

### Automatic Package Name Fallback

When `packageName` is omitted, `verifyPackageVersion` reads the `"name"` field from the target manifest for diagnostic logging:

```ts
import { verifyPackageVersion } from "@vickbk/ci-tools/packages";

// If version field is missing, error message automatically includes manifest name
await verifyPackageVersion({
  packagePath: "./node_modules/my-dep/package.json",
  expectedVersion: "2.0.0",
});
```

## Error Handling

`verifyPackageVersion` throws an `Error` in the following failure scenarios:

1. **Missing `"version"` Field**: Throws an error identifying the package name and path:
   `No "version" field found in @scope/pkg at "./path/to/package.json"`
2. **File System & Parse Failures**: Propagates native `readJsonFile` errors (e.g., `ENOENT` for missing files, invalid JSON syntax).
````

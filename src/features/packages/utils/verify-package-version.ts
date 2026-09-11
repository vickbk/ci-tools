import { readJsonFile } from "@/shared/files";
import type {
  PackageManifest,
  VerifyPackageOptions,
  VerifyPackageResult,
} from "../types";

/**
 * Reads a JSON package manifest from the filesystem and verifies whether its
 * `"version"` string matches an expected target version.
 *
 * @param options - Configuration options controlling path resolution and target version expectations.
 * @param options.packagePath - Relative or absolute filesystem path to the target package JSON file.
 * @param options.expectedVersion - The expected semantic version string to compare against (e.g., `"1.0.0"`).
 * @param options.packageName - Optional package name for error diagnostics. Falls back to the `"name"` field in `package.json` if omitted.
 *
 * @returns A promise resolving to a {@link VerifyPackageResult} containing comparison details.
 *
 * @throws {@link Error}
 * Thrown if the target file cannot be read, parsed, or if the manifest is missing a valid `"version"` string.
 *
 * @example
 * **Basic usage with explicit expected version:**
 * ```ts
 * const result = await verifyPackageVersion({
 *   packagePath: "./package.json",
 *   expectedVersion: "1.0.0",
 * });
 *
 * if (!result.matches) {
 *   console.warn(`Version mismatch! Expected ${result.expectedVersion}, got ${result.currentVersion}`);
 * }
 * ```
 *
 * @example
 * **Explicit package name override for custom errors:**
 * ```ts
 * const result = await verifyPackageVersion({
 *   packagePath: "./node_modules/foo/package.json",
 *   expectedVersion: "3.2.0",
 *   packageName: "foo-override",
 * });
 * ```
 */
export async function verifyPackageVersion({
  packagePath,
  expectedVersion,
  packageName,
}: VerifyPackageOptions): Promise<VerifyPackageResult> {
  const manifest = await readJsonFile<PackageManifest>({
    filePath: packagePath,
  });

  if (!manifest?.version) {
    const resolvedName = packageName ?? manifest?.name;
    const pkgContext = resolvedName ? `${resolvedName} at ` : "";
    throw new Error(
      `No "version" field found in ${pkgContext}"${packagePath}"`,
    );
  }

  const currentVersion = manifest.version;

  return {
    currentVersion,
    expectedVersion,
    matches: currentVersion === expectedVersion,
  };
}

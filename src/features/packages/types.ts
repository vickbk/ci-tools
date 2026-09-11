/**
 * Represents the structure of a standard package manifest (`package.json`).
 */
export type PackageManifest = {
  /**
   * The formal name of the package (e.g., `"@vickbk/ci-tools"`).
   */
  name?: string;

  /**
   * The current semantic version string of the package (e.g., `"1.2.3"`).
   */
  version?: string;
};

/**
 * Options required to configure and execute {@link verifyPackageVersion}.
 */
export type VerifyPackageOptions = {
  /**
   * Relative or absolute filesystem path to the target package JSON file.
   *
   * @example `"./package.json"`
   * @example `"./node_modules/my-lib/package.json"`
   */
  packagePath: string;

  /**
   * The version string expected to be present in the target package manifest.
   *
   * @example `"2.0.0"`
   */
  expectedVersion: string;

  /**
   * Optional human-readable package identifier used in diagnostic error messages.
   *
   * @remarks
   * If omitted, {@link verifyPackageVersion} will attempt to resolve the package
   * name directly from the manifest's {@link PackageManifest.name `"name"`} property.
   *
   * @example `"my-lib"`
   */
  packageName?: string;
};

/**
 * Comparative version metadata returned by {@link verifyPackageVersion}.
 */
export type VerifyPackageResult = {
  /**
   * The version string extracted directly from the target package manifest.
   *
   * @example `"1.2.4"`
   */
  currentVersion: string;

  /**
   * The target version supplied in {@link VerifyPackageOptions.expectedVersion}.
   *
   * @example `"1.2.3"`
   */
  expectedVersion: string;

  /**
   * Indicates whether {@link VerifyPackageResult.currentVersion} strictly equals
   * {@link VerifyPackageResult.expectedVersion}.
   *
   * - `true`: The package version matches the expectation.
   * - `false`: A version drift or mismatch was detected.
   */
  matches: boolean;
};

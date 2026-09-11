import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { verifyPackageVersion } from "../index";

describe("verifyPackageVersion (Integration)", () => {
  const testDir = join(process.cwd(), ".dump", "__tmp_integration_tests__");

  beforeEach(async () => {
    // Create an isolated temporary test directory before each test
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up temporary files after each test run
    await rm(testDir, { recursive: true, force: true });
  });

  it("reads a valid package.json and accurately verifies matching versions", async () => {
    const pkgPath = join(testDir, "package.json");
    await writeFile(
      pkgPath,
      JSON.stringify({ name: "@vickbk/test-pkg", version: "2.4.0" }),
      "utf-8",
    );

    const result = await verifyPackageVersion({
      packagePath: pkgPath,
      expectedVersion: "2.4.0",
    });

    expect(result).toEqual({
      currentVersion: "2.4.0",
      expectedVersion: "2.4.0",
      matches: true,
    });
  });

  it("detects a version mismatch in a real JSON file", async () => {
    const pkgPath = join(testDir, "package.json");
    await writeFile(
      pkgPath,
      JSON.stringify({ name: "@vickbk/test-pkg", version: "2.4.1" }),
      "utf-8",
    );

    const result = await verifyPackageVersion({
      packagePath: pkgPath,
      expectedVersion: "2.4.0",
    });

    expect(result).toEqual({
      currentVersion: "2.4.1",
      expectedVersion: "2.4.0",
      matches: false,
    });
  });

  it("resolves the package name from disk when missing a version field", async () => {
    const pkgPath = join(testDir, "package.json");
    await writeFile(
      pkgPath,
      JSON.stringify({ name: "@vickbk/no-version-pkg" }),
      "utf-8",
    );

    await expect(
      verifyPackageVersion({
        packagePath: pkgPath,
        expectedVersion: "1.0.0",
      }),
    ).rejects.toThrow(
      `No "version" field found in @vickbk/no-version-pkg at "${pkgPath}"`,
    );
  });

  it("handles malformed JSON files gracefully by letting readJsonFile reject", async () => {
    const pkgPath = join(testDir, "malformed.json");
    await writeFile(pkgPath, "{ invalid json content ", "utf-8");

    await expect(
      verifyPackageVersion({
        packagePath: pkgPath,
        expectedVersion: "1.0.0",
      }),
    ).rejects.toThrow();
  });

  it("fails when the package file does not exist on disk", async () => {
    const nonExistentPath = join(testDir, "missing-package.json");

    await expect(
      verifyPackageVersion({
        packagePath: nonExistentPath,
        expectedVersion: "1.0.0",
      }),
    ).rejects.toThrow();
  });
});

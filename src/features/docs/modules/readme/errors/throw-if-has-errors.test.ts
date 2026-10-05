import { describe, expect, it } from "vitest";
import type { FileValidationResult } from "../types";
import { throwIfHasErrors } from "./throw-if-has-errors";

describe("throwIfHasErrors", () => {
  it("should complete successfully without throwing when all validation results are successful", () => {
    const results: FileValidationResult[] = [
      { path: "README.md", error: undefined },
      { path: "packages/core/README.md", error: undefined },
    ];

    expect(() => throwIfHasErrors(results)).not.toThrow();
  });

  it("should complete successfully without throwing when the results array is empty", () => {
    const results: FileValidationResult[] = [];

    expect(() => throwIfHasErrors(results)).not.toThrow();
  });

  it("should throw an AggregateError containing exactly one error when a single result fails", () => {
    const validationError = new Error("Missing '## Installation' section");
    const results: FileValidationResult[] = [
      { path: "README.md", error: undefined },
      { path: "packages/core/README.md", error: validationError },
    ];

    let thrownError: unknown;
    try {
      throwIfHasErrors(results);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(AggregateError);
    const aggregate = thrownError as AggregateError;
    expect(aggregate.message).toBe("README validation failed for 1 target(s).");
    expect(aggregate.errors).toEqual([validationError]);
  });

  it("should throw an AggregateError containing all errors when multiple results fail", () => {
    const firstError = new Error("Missing header");
    const secondError = new Error("Broken link detected");
    const results: FileValidationResult[] = [
      { path: "README.md", error: firstError },
      { path: "docs/index.md", error: secondError },
      { path: "packages/ui/README.md", error: undefined },
    ];

    let thrownError: unknown;
    try {
      throwIfHasErrors(results);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(AggregateError);
    const aggregate = thrownError as AggregateError;
    expect(aggregate.message).toBe("README validation failed for 2 target(s).");
    expect(aggregate.errors).toEqual([firstError, secondError]);
  });
});

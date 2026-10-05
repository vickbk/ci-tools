import { FileValidationResult } from "../types";

/**
 * Throws an AggregateError if any of the provided FileValidationResult objects contain an error.
 * @param results The array of FileValidationResult objects to check for errors.
 */
export function throwIfHasErrors(results: FileValidationResult[]): void {
  const errors = results
    .map((result) => result.error)
    .filter((error): error is NonNullable<typeof error> => error !== undefined);

  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      `README validation failed for ${errors.length} target(s).`,
    );
  }
}

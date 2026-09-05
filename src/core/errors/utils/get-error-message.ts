/**
 * Normalizes any caught value into a clean, human-readable error string.
 *
 * @param error - An unknown value caught from a failed operation.
 * @returns A readable message for errors, objects, primitives, and circular values.
 * @example
 * ```ts
 * const message = getErrorMessage(error);
 * ```
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
    try {
      return JSON.stringify(error);
    } catch {
      // Fall through to String(error) if circular references exist
    }
  }

  return String(error);
}

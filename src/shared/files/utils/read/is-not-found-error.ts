/**
 * Determines whether an unknown filesystem error represents a missing file.
 *
 * @param err - Unknown value caught from a filesystem operation.
 * @returns `true` when the error or its cause contains the `ENOENT` code.
 * @example
 * ```ts
 * if (isNotFoundError(error)) return null;
 * ```
 */
export function isNotFoundError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const cause = err.cause as { code?: string } | undefined;
  return cause?.code === "ENOENT" || err.message.includes("ENOENT");
}

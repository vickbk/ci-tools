/**
 * Strips OS drive letters (e.g., "D:", "C:") and normalizes backslashes to forward slashes.
 *
 * @param filePath - Path string to normalize.
 * @param replaceSlashes - Whether to convert backslashes to forward slashes.
 * @returns The normalized path string.
 * @example
 * ```ts
 * normalizePath("C:\\workspace\\README.md");
 * ```
 */
export function normalizePath(filePath: string, replaceSlashes = true): string {
  let normalized = filePath.replace(/^[a-zA-Z]:/, "");
  if (replaceSlashes) normalized = normalized.replace(/\\/g, "/");
  return normalized;
}

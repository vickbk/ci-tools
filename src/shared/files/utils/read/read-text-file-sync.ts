import fs from "node:fs";
import { ReadTextFileOptions } from "../../types";
import { getFullPath } from "./get-fullpath";

/**
 * Synchronously reads a text file, enforcing path bounds (if baseDir is provided)
 * and wrapping I/O errors with original cause preservation.
 *
 * @param options - File path, base directory, and text encoding options.
 * @returns The file contents as text.
 * @throws {Error} When the path is outside the base directory or the file cannot be read.
 * @example
 * ```ts
 * const content = readTextFileSync({ filePath: "README.md" });
 * ```
 */
export function readTextFileSync({
  encoding = "utf-8",
  ...options
}: ReadTextFileOptions): string {
  const fullPath = getFullPath(options);

  try {
    return fs.readFileSync(fullPath, { encoding });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`[IO Error] Failed to read "${fullPath}": ${detail}`, {
      cause: err,
    });
  }
}

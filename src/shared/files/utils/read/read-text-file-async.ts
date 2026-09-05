import fs from "node:fs/promises";
import { ReadTextFileOptions } from "../../types";
import { getFullPath } from "./get-fullpath";

/**
 * Asynchronously reads a text file, enforcing path bounds (if baseDir is provided)
 * and wrapping I/O errors with original cause preservation.
 *
 * @param options - File path, base directory, and text encoding options.
 * @returns A promise resolving to the file contents as text.
 * @throws {Error} When the path is outside the base directory or the file cannot be read.
 * @example
 * ```ts
 * const content = await readTextFileAsync({ filePath: "README.md" });
 * ```
 */
export async function readTextFileAsync({
  encoding = "utf8",
  ...options
}: ReadTextFileOptions): Promise<string> {
  const fullPath = getFullPath(options);

  try {
    return await fs.readFile(fullPath, { encoding });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`[IO Error] Failed to read "${fullPath}": ${detail}`, {
      cause: err,
    });
  }
}

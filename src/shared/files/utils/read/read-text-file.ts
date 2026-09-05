import { readTextFileAsync } from "./read-text-file-async";

/**
 * Reads a UTF-8 text file from disk, attaching a clean prefix while preserving the original error cause.
 *
 * @param filePath - Absolute or working-directory-relative file path.
 * @returns A promise resolving to the file contents as UTF-8 text.
 * @throws {Error} When the file cannot be read.
 * @example
 * ```ts
 * const content = await readTextFile("README.md");
 * ```
 */
export async function readTextFile(filePath: string): Promise<string> {
  return await readTextFileAsync({ filePath });
}

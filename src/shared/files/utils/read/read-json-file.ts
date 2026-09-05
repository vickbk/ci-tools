import path from "node:path";
import { ReadTextFileOptions } from "../../types";
import { readTextFileAsync } from "./read-text-file-async";

/**
 * Asynchronously reads and parses a JSON file, wrapping syntax errors with
 * file context while preserving the original cause.
 *
 * @param options - File path, base directory, and text encoding options.
 * @returns A promise resolving to the parsed JSON value.
 * @throws {Error} When the file cannot be read or its contents are invalid JSON.
 * @example
 * ```ts
 * const manifest = await readJsonFile<{ version: string }>({ filePath: "package.json" });
 * ```
 */
export async function readJsonFile<T>(
  options: ReadTextFileOptions,
): Promise<T> {
  const data = await readTextFileAsync(options);

  try {
    return JSON.parse(data) as T;
  } catch (err) {
    const targetPath = options.baseDir
      ? path.resolve(options.baseDir, options.filePath)
      : options.filePath;

    const detail = err instanceof Error ? err.message : String(err);

    throw new Error(
      `[JSON Parse Error] Failed to parse JSON from "${targetPath}": ${detail}`,
      { cause: err },
    );
  }
}

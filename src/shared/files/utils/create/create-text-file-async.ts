import fs from "node:fs/promises";
import path from "node:path";
import { CreateTextFileOptions } from "../../types";
import { getPathFlag } from "./get-path-flag";

/**
 * Creates a text file asynchronously, creating parent directories as needed.
 *
 * @param options - File content, target path, and overwrite settings.
 * @returns A promise resolving to the absolute path of the created file.
 * @throws {Error} When the target path is outside the configured base directory
 * or the filesystem operation fails.
 * @example
 * ```ts
 * await createTextFileAsync({ filePath: "report.txt", content: "done" });
 * ```
 */
export async function createTextFileAsync({
  content,
  ...options
}: CreateTextFileOptions): Promise<string> {
  const { fullPath, flag } = getPathFlag(options);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, { encoding: "utf8", flag });

  return fullPath;
}

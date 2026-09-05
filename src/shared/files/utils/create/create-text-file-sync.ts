import fs from "node:fs";
import path from "node:path";
import { CreateTextFileOptions } from "../../types";
import { getPathFlag } from "./get-path-flag";

/**
 * Creates a text file synchronously, creating parent directories as needed.
 *
 * @param options - File content, target path, and overwrite settings.
 * @returns The absolute path of the created file.
 * @throws {Error} When the target path is outside the configured base directory
 * or the filesystem operation fails.
 * @example
 * ```ts
 * createTextFileSync({ filePath: "report.txt", content: "done" });
 * ```
 */
export function createTextFileSync({
  content,
  ...options
}: CreateTextFileOptions): string {
  const { fullPath, flag } = getPathFlag(options);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  fs.writeFileSync(fullPath, content, { encoding: "utf8", flag });

  return fullPath;
}

import fs from "node:fs";
import { ReadTextFileOptions } from "../../types";
import { getFullPath } from "./get-fullpath";

/**
 * Synchronously reads a text file, enforcing path bounds (if baseDir is provided)
 * and wrapping I/O errors with original cause preservation.
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

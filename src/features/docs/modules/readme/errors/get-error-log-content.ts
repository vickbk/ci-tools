import { isNotFoundError, readTextFileAsync } from "@/shared/files";
import path from "node:path";
import { README_ERROR_LOG_FILE } from "./config";

const LOG_FILE_PATH = path.join(".dump", README_ERROR_LOG_FILE);

/**
 * Reads the README validation error log when it exists.
 *
 * @returns A promise resolving to the log content, or `null` when no log exists.
 * @throws {Error} When the log exists but cannot be read.
 */
export async function getErrorLogContent(): Promise<string | null> {
  try {
    return await readTextFileAsync({
      filePath: LOG_FILE_PATH,
    });
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}

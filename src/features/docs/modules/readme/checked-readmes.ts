import {
  createTextFileAsync,
  isNotFoundError,
  readTextFileAsync,
} from "@/shared/files";
import { CHECKED_READMES_LIST } from "./errors/config";
import { FileValidationResult } from "./types";

/**
 * Saves the list of checked readmes to a file.
 * @param results The validation results for each readme file.
 */
export async function saveCheckedReadmes(results: FileValidationResult[]) {
  const files = results.map(
    (result) => `(${result.path}) = ${result.error ? "❌" : "✅"}`,
  );

  const content = `# Checked Readmes\n\n${files.join("\n")}\n`;
  await createTextFileAsync({
    filePath: CHECKED_READMES_LIST,
    content,
  });
}

/**
 * Reads the list of checked readmes from a file.
 * @returns A promise resolving to the content of the file or an empty string if a not found error occurs.
 * it throws any other errors encountered during the read operation.
 */
export async function readCheckedReadmes(): Promise<string> {
  try {
    return await readTextFileAsync({
      filePath: CHECKED_READMES_LIST,
      baseDir: ".dump",
    });
  } catch (error) {
    if (isNotFoundError(error)) {
      return "";
    }
    throw error;
  }
}

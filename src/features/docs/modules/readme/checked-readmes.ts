import { createTextFileAsync, readTextFileAsync } from "@/shared/files";
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
 * @returns A promise resolving to the content of the file or an empty string if an error occurs.
 */
export async function readCheckedReadmes(): Promise<string> {
  try {
    return await readTextFileAsync({ filePath: CHECKED_READMES_LIST });
  } catch (error) {
    console.error(
      `Error reading checked readmes from ${CHECKED_READMES_LIST}:`,
      error,
    );
    return "";
  }
}

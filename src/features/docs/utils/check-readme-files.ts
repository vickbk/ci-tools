// scripts/features/docs/utils/orchestration/check-readme-files.ts
import { DocumentationContract } from "@/shared/types";
import type { FileValidationResult } from "../modules/readme";
import { checkReadmeFile } from "../modules/readme";
import { saveCheckedReadmes } from "../modules/readme/checked-readmes";
import { throwIfHasErrors } from "../modules/readme/errors/throw-if-has-errors";

/**
 * Validates multiple README targets in parallel using a path-to-contract map.
 *
 * @param {Record<string, DocumentationContract>} targets - Map of file paths to their contracts.
 * @returns {Promise<FileValidationResult[]>} The validation results if all targets pass.
 * @throws {AggregateError} If one or more README validation or filesystem errors occur.
 */
export async function checkReadmeFiles(
  targets: Record<string, DocumentationContract>,
): Promise<FileValidationResult[]> {
  const entries = Object.entries(targets);

  const results = await Promise.all(
    entries.map(([path, contract]) => checkReadmeFile({ path, contract })),
  );

  await saveCheckedReadmes(results);
  throwIfHasErrors(results);

  return results;
}

import { config } from "@/config";
import { readCheckedReadmes } from "../checked-readmes";
import { getErrorLogContent } from "../errors/get-error-log-content";

/** Comment body used when README validation completes without diagnostics. */
export const SUCCESS_MESSAGE =
  "✅ Documentation check completed successfully. No issues found.";
/** Comment body used when README validation did not run. */
export const SKIPPED_MESSAGE =
  "⚠️ Documentation check did not run. Cannot determine documentation status.";

/**
 * Reads the README validation log and returns the comment body for the workflow.
 * It also includes the list of checked files.
 *
 * @returns A promise containing the success, skipped, or diagnostic message.
 * @throws {Error} When the validation log cannot be read.
 */
export async function getCommentBody(): Promise<string> {
  if (config.docs.hasRun !== true) {
    return SKIPPED_MESSAGE;
  }

  const message = (await getErrorLogContent()) ?? SUCCESS_MESSAGE;
  const checkedList = await readCheckedReadmes();

  if (!checkedList) return message;

  return checkedList + "\n\n---\n\n" + message;
}

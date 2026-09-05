import { config } from "@/config";
import { getErrorLogContent } from "../modules/readme";

/** Comment body used when README validation completes without diagnostics. */
export const SUCCESS_MESSAGE =
  "✅ Documentation check completed successfully. No issues found.";
/** Comment body used when README validation did not run. */
export const SKIPPED_MESSAGE =
  "⚠️ Documentation check did not run. Cannot determine documentation status.";

/**
 * Reads the README validation log and returns the comment body for the workflow.
 *
 * @returns A promise containing the success, skipped, or diagnostic message.
 * @throws {Error} When the validation log cannot be read.
 */
export async function getCommentBody(): Promise<string> {
  if (config.docs.hasRun !== true) {
    return SKIPPED_MESSAGE;
  }
  return (await getErrorLogContent()) ?? SUCCESS_MESSAGE;
}

import path from "node:path";
import process from "node:process";
import { LogFormatter } from "../types";
import { handleFatalError } from "./handle-fatal-error";

/**
 * Executes a CLI task wrapped in a standardized error boundary.
 *
 * **CLI Boundary Notice:** This function is a process-aware CLI orchestrator.
 * It inspects the entry script, intercepts task failures, formats fatal errors,
 * and delegates process exit-code handling. Avoid using it in pure library code.
 *
 * @param scriptName - Substring or filename to match against process.argv[1]
 * @param task - Sync or async callback function to execute
 * @param errorPrefix - Custom prefix or formatter (defaults to `❌ [scriptName] Fatal Error`)
 * @returns The task result when this process is running the matching script, or
 * `undefined` when the current entry script does not match.
 * @throws Does not rethrow task failures; matching failures are delegated to
 * {@link handleFatalError}, which terminates the process.
 * @example
 * ```ts
 * await runTask("release-note", () => extractReleaseNotes());
 * ```
 */
export async function runTask<T>(
  scriptName: string,
  task: () => T | Promise<T>,
  errorPrefix?: LogFormatter,
): Promise<T | undefined> {
  const entryScript = process.argv[1];

  if (!entryScript) {
    return undefined;
  }

  const { name, base } = path.parse(entryScript);

  // Exact comparison against file stem ("extract-version-tag") or full filename ("extract-version-tag.ts")
  const isMatch = scriptName === name || scriptName === base;

  if (!isMatch) {
    return undefined;
  }

  const resolvedPrefix = errorPrefix ?? `❌ [${scriptName}] Fatal Error`;

  try {
    return await task();
  } catch (error) {
    handleFatalError(error, resolvedPrefix);
  }
}

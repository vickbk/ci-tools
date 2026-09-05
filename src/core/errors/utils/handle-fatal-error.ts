import process from "node:process";
import { LogFormatter } from "../types";
import { getErrorMessage } from "./get-error-message";

/**
 * Logs a formatted fatal error message and terminates the current CLI process.
 *
 * **CLI Boundary Notice:** This is a process-aware error boundary for executable
 * scripts. It formats fatal state, writes it to stderr, and calls
 * `process.exit`, so it must not be used by pure SDK consumers.
 *
 * @param error - The caught raw error object
 * @param prefixOrFormatter - Prefix string (defaults to "Fatal Error") or custom error formatter function
 * @param exitCode - Process exit code (defaults to 1)
 * @returns Never; the process exits after the formatted error is logged.
 * @example
 * ```ts
 * try {
 *   await runWorkflow();
 * } catch (error) {
 *   handleFatalError(error, "Workflow failed");
 * }
 * ```
 */
export function handleFatalError(
  error: unknown,
  prefixOrFormatter: LogFormatter = "Fatal Error",
  exitCode = 1,
): never {
  const formattedLog =
    typeof prefixOrFormatter === "function"
      ? prefixOrFormatter(error)
      : `${prefixOrFormatter}: ${getErrorMessage(error)}`;

  console.error(formattedLog);
  process.exit(exitCode);
}

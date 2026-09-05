/**
 * Core error and CLI lifecycle utilities.
 * `runTask` and `handleFatalError` are process-aware helpers for executable
 * repository scripts; `getErrorMessage` is safe for general library use.
 */
/** Normalizes unknown thrown values into a readable error message. */
export { getErrorMessage } from "./utils/get-error-message";
/** Logs a formatted fatal state and terminates the current CLI process. */
export { handleFatalError } from "./utils/handle-fatal-error";
/** Executes a matching CLI task through the fatal-error boundary. */
export { runTask } from "./utils/run-task";

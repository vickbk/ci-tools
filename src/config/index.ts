/**
 * Re-exports the runtime configuration proxy used across workflow automation scripts.
 */
export { config } from "./utils/env";
export { getConfig, resetConfig } from "./utils/get-config";
export type { Config, ConfigError } from "./types";

import path from "node:path";

/** Default directory used for generated and temporary file output. */
export const DUMP_DIR = path.resolve(process.cwd(), ".dump");

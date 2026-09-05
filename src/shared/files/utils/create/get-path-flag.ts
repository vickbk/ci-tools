import path from "node:path";
import { CreateTextFileOptions } from "../../types";
import { DUMP_DIR } from "../config";

export function getPathFlag({
  baseDir = DUMP_DIR,
  filePath,
  overwrite = true,
}: Omit<CreateTextFileOptions, "content">) {
  const resolvedBase = path.resolve(baseDir);
  const fullPath = path.resolve(resolvedBase, filePath);

  // Prevent path traversal outside baseDir
  const relative = path.relative(resolvedBase, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Access denied: Target path outside "${resolvedBase}"`);
  }

  const flag = overwrite ? "w" : "wx";
  return { flag, fullPath };
}

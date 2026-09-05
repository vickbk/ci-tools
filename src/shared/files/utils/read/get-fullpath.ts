import path from "node:path";
import { ReadTextFileOptions } from "../../types";

export function getFullPath({
  filePath,
  baseDir,
}: ReadTextFileOptions): string {
  const fullPath = baseDir
    ? path.resolve(baseDir, filePath)
    : path.resolve(filePath);

  if (baseDir) {
    const resolvedBase = path.resolve(baseDir);
    const relative = path.relative(resolvedBase, fullPath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error(
        `[IO Error] Access denied: Target path outside "${resolvedBase}"`,
      );
    }
  }
  return fullPath;
}

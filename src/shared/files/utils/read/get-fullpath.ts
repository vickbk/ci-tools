import path from "node:path";
import { ReadTextFileOptions } from "../../types";

/**
 * Resolves a file path and enforces the optional base-directory boundary.
 *
 * @param options - File path and optional base directory.
 * @returns The absolute path used by the file-reading operation.
 * @throws {Error} When path traversal would place the target outside `baseDir`.
 * @example
 * ```ts
 * const fullPath = getFullPath({ filePath: "README.md", baseDir: process.cwd() });
 * ```
 */
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

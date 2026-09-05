import fs from "node:fs";
import path from "node:path";
import { CreateTextFileOptions } from "../../types";
import { getPathFlag } from "./get-path-flag";

export function createTextFileSync({
  content,
  ...options
}: CreateTextFileOptions): string {
  const { fullPath, flag } = getPathFlag(options);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  fs.writeFileSync(fullPath, content, { encoding: "utf8", flag });

  return fullPath;
}

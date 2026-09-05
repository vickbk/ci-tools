import fs from "node:fs/promises";
import path from "node:path";
import { CreateTextFileOptions } from "../../types";
import { getPathFlag } from "./get-path-flag";

export async function createTextFileAsync({
  content,
  ...options
}: CreateTextFileOptions): Promise<string> {
  const { fullPath, flag } = getPathFlag(options);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, { encoding: "utf8", flag });

  return fullPath;
}

import { runTask } from "@/core/errors";
import { checkReadmeFiles, handleReadmeCliError } from "@/features/docs";

await runTask(
  "readme-check",
  async () => await checkReadmeFiles({}),
  handleReadmeCliError,
);

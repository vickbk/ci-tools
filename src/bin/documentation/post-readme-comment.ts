import { runTask } from "@/core/errors";
import { postReadmeComment } from "@/features/docs";

await runTask(
  "post-readme-comment",
  postReadmeComment,
  "❌ [Readme Reporter] Fatal Error",
);

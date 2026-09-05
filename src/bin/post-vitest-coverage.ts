import { runTask } from "@/core/errors";
import { postCoverageComment } from "@/features/vitest";

await runTask(
  "post-vitest-coverage",
  postCoverageComment,
  "❌ [Coverage Runner] Fatal error",
);

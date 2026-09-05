import { runTask } from "@/core/errors";
import { extractReleaseNotes } from "@/features/releases";

await runTask(
  "extract-release-note",
  () => extractReleaseNotes({ versionTag: process.argv[2] }),
  "❌ [Release Note] Fatal Error",
);

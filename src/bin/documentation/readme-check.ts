import { rootReadmeContract } from "#/readme-contract";
import { runTask } from "@/core/errors";
import { githubReadmeContract } from "@/core/github/readme-contract";
import { coreReadmeContract } from "@/core/readme-contract";
import { checkReadmeFiles, handleReadmeCliError } from "@/features/docs";
import { docsReadmeContract } from "@/features/docs/readme-contract";
import { releasesReadmeContract } from "@/features/releases/readme-contract";
import { vitestReadmeContract } from "@/features/vitest/readme-contract";

await runTask(
  "readme-check",
  async () =>
    await checkReadmeFiles({
      "./README.md": rootReadmeContract,
      "./src/core/README.md": coreReadmeContract,
      "./src/features/docs/README.md": docsReadmeContract,
      "./src/core/github/README.md": githubReadmeContract,
      "./src/features/releases/README.md": releasesReadmeContract,
      "./src/features/vitest/README.md": vitestReadmeContract,
    }),
  handleReadmeCliError,
);

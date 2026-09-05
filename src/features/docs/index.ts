/**
 * Documentation contract validation and workflow reporting API.
 *
 * @example
 * ```ts
 * import { checkReadmeFiles } from "@vickbk/ci-tools/docs";
 *
 * await checkReadmeFiles({ "./README.md": contract });
 * ```
 */
/** Formats README validation failures for the CLI error boundary. */
export { handleReadmeCliError } from "./modules/readme";
/** Public result and parsed-heading shapes returned by README validation. */
export type {
  FileValidationResult,
  MatchedReadmeSection,
  ParsedReadmeHeading,
  ReadmeSectionDiagnostic,
  ReadmeSectionValidationResult,
  ReadmeTarget,
} from "./modules/readme/types";
/** Validates multiple README files against their documentation contracts. */
export { checkReadmeFiles } from "./utils/check-readme-files";
/** Posts or updates the README validation comment in the active pull request. */
export { postReadmeComment } from "./utils/post-readme-comment";
/** Contract describing required README sections and requirements. */
export type { DocumentationContract } from "@/shared/types";

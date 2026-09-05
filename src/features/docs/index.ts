/**
 * Public README section validation entry point for the documentation guardrails.
 */
export { handleReadmeCliError } from "./modules/readme";
export type {
  FileValidationResult,
  MatchedReadmeSection,
  ParsedReadmeHeading,
  ReadmeSectionDiagnostic,
  ReadmeSectionValidationResult,
  ReadmeTarget,
} from "./modules/readme/types";
export { checkReadmeFiles } from "./utils/check-readme-files";
export { postReadmeComment } from "./utils/post-readme-comment";
export type { DocumentationContract } from "@/shared/types";

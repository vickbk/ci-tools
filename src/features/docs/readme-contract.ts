import type { DocumentationContract } from "@/shared/types";

const sharedRequirements = {
  codeBlock: true,
  packageManagerCommands: true,
  publicEntryPoints: true,
};

/** Documentation contract for the README validation and documentation feature README. */
export const docsReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools/docs",
  sections: [
    { id: "overview", heading: "Overview", required: true },
    { id: "features", heading: "Features", required: true },
    {
      id: "usage",
      heading: "Usage",
      required: true,
      requirements: sharedRequirements,
    },
    { id: "validation-rules", heading: "Validation rules", required: true },
    { id: "license", heading: "License", required: false },
  ],
  preferredSectionOrder: [
    "overview",
    "features",
    "usage",
    "validation-rules",
    "license",
  ],
  requiredSectionIds: ["overview", "features", "usage", "validation-rules"],
  recommendedSectionIds: ["license"],
};

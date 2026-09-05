import type { DocumentationContract } from "@/shared/types";

export const githubReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools/github",
  sections: [
    { id: "overview", heading: "Overview", required: true },
    { id: "key-modules", heading: "Key modules", required: true },
    {
      id: "required-environment-variables",
      heading: "Required environment variables",
      required: true,
    },
    {
      id: "usage-example",
      heading: "Usage example",
      required: true,
      requirements: { codeBlock: true },
    },
  ],
  preferredSectionOrder: [
    "overview",
    "key-modules",
    "required-environment-variables",
    "usage-example",
  ],
  requiredSectionIds: [
    "overview",
    "key-modules",
    "required-environment-variables",
    "usage-example",
  ],
  recommendedSectionIds: [],
};

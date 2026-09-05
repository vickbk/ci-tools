import type { DocumentationContract } from "@/shared/types";

export const releasesReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools/releases",
  sections: [
    { id: "overview", heading: "Overview", required: true },
    { id: "key-modules", heading: "Key modules", required: true },
    {
      id: "usage-example",
      heading: "Usage example",
      required: true,
      requirements: { codeBlock: true },
    },
    {
      id: "environment-variables",
      heading: "Environment variables",
      required: true,
    },
  ],
  preferredSectionOrder: [
    "overview",
    "key-modules",
    "usage-example",
    "environment-variables",
  ],
  requiredSectionIds: [
    "overview",
    "key-modules",
    "usage-example",
    "environment-variables",
  ],
  recommendedSectionIds: [],
};

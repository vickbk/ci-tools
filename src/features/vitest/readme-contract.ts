import type { DocumentationContract } from "@/shared/types";

/** Documentation contract for the Vitest coverage reporting feature README. */
export const vitestReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools/vitest",
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
      id: "required-environment-variables",
      heading: "Required environment variables",
      required: true,
    },
  ],
  preferredSectionOrder: [
    "overview",
    "key-modules",
    "usage-example",
    "required-environment-variables",
  ],
  requiredSectionIds: [
    "overview",
    "key-modules",
    "usage-example",
    "required-environment-variables",
  ],
  recommendedSectionIds: [],
};

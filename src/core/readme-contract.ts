import type { DocumentationContract } from "@/shared/types";

export const coreReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools/core",
  sections: [
    { id: "overview", heading: "Overview", required: true },
    { id: "key-modules", heading: "Key modules", required: true },
    {
      id: "usage-example",
      heading: "Usage example",
      required: true,
      requirements: { codeBlock: true },
    },
    { id: "error-strategy", heading: "Error strategy", required: true },
  ],
  preferredSectionOrder: [
    "overview",
    "key-modules",
    "usage-example",
    "error-strategy",
  ],
  requiredSectionIds: [
    "overview",
    "key-modules",
    "usage-example",
    "error-strategy",
  ],
  recommendedSectionIds: [],
};

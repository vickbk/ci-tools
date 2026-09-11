import { DocumentationContract } from "@/shared";

export const packagesReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools/packages",
  sections: [
    {
      id: "identity",
      heading: "Package Verification Module",
      required: true,
      aliases: ["Packages Module", "Package Utilities"],
    },
    {
      id: "overview",
      heading: "Overview",
      required: true,
    },
    {
      id: "api-reference",
      heading: "API Reference",
      required: true,
      aliases: ["API Signature", "Exported Utilities"],
      requirements: {
        publicEntryPoints: true,
      },
    },
    {
      id: "usage",
      heading: "Usage Examples",
      required: true,
      aliases: ["Usage", "Examples"],
      requirements: {
        codeBlock: true,
      },
    },
    {
      id: "error-handling",
      heading: "Error Handling",
      required: false,
    },
  ],
  preferredSectionOrder: [
    "identity",
    "overview",
    "api-reference",
    "usage",
    "error-handling",
  ],
  requiredSectionIds: ["identity", "overview", "api-reference", "usage"],
  recommendedSectionIds: ["error-handling"],
};

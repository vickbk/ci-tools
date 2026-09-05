import type { DocumentationContract } from "@/shared/types";

export const rootReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools",
  sections: [
    { id: "identity", heading: "@vickbk/ci-tools", required: true },
    { id: "overview", heading: "Overview", required: true },
    {
      id: "installation",
      heading: "Installation",
      required: true,
      requirements: { packageManagerCommands: true },
    },
    {
      id: "subpath-exports",
      heading: "Subpath Exports",
      required: true,
      requirements: { publicEntryPoints: true },
    },
    {
      id: "usage",
      heading: "Usage",
      required: true,
      requirements: { codeBlock: true, packageManagerCommands: true },
    },
    {
      id: "architecture",
      heading: "Architecture",
      required: false,
      requirements: { publicEntryPoints: true },
    },
    { id: "license", heading: "License", required: true },
  ],
  preferredSectionOrder: [
    "identity",
    "overview",
    "installation",
    "subpath-exports",
    "usage",
    "architecture",
    "license",
  ],
  requiredSectionIds: [
    "identity",
    "overview",
    "installation",
    "subpath-exports",
    "usage",
    "license",
  ],
  recommendedSectionIds: ["architecture"],
};

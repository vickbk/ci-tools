import type { DocumentationContract } from "@/shared/types";

/** Documentation contract for the package root README and its public SDK overview. */
export const rootReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools",
  sections: [
    { id: "identity", heading: "@vickbk/ci-tools", required: true },
    { id: "overview", heading: "Overview", required: true },
    {
      id: "quick-start",
      heading: "Quick Start",
      required: true,
      requirements: { codeBlock: true, packageManagerCommands: true },
    },
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
      id: "programmatic-api",
      heading: "Programmatic API Examples",
      required: true,
      requirements: { codeBlock: true, publicEntryPoints: true },
    },
    {
      id: "custom-helpers",
      heading: "Custom Helpers",
      required: true,
      requirements: { codeBlock: true, publicEntryPoints: true },
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
    "quick-start",
    "installation",
    "subpath-exports",
    "usage",
    "programmatic-api",
    "custom-helpers",
    "architecture",
    "license",
  ],
  requiredSectionIds: [
    "identity",
    "overview",
    "quick-start",
    "installation",
    "subpath-exports",
    "usage",
    "programmatic-api",
    "custom-helpers",
    "license",
  ],
  recommendedSectionIds: ["architecture"],
};

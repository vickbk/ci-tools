import type { DocumentationContract } from "@/shared/types";

/** Documentation contract for the package root README and its public SDK overview. */
export const rootReadmeContract: DocumentationContract = {
  packageName: "@vickbk/ci-tools",
  sections: [
    { id: "identity", heading: "@vickbk/ci-tools", required: true },
    { id: "overview", heading: "Overview", required: true },
    {
      id: "features",
      heading: "Features & Value Proposition",
      required: true,
    },
    {
      id: "installation",
      heading: "Installation",
      required: true,
      requirements: { packageManagerCommands: true },
    },
    {
      id: "workflow-setup",
      heading: "Workflow Setup & Task Orchestration",
      required: true,
      requirements: { codeBlock: true, packageManagerCommands: true },
    },
    {
      id: "standalone-examples",
      heading: "Standalone Module Examples",
      required: true,
      requirements: { codeBlock: true, publicEntryPoints: true },
    },
    {
      id: "environment-variables",
      heading: "Environment Variables",
      required: true,
    },
    {
      id: "subpath-exports",
      heading: "Subpath Export Reference",
      required: true,
      requirements: { publicEntryPoints: true },
    },
    {
      id: "verification-build",
      heading: "Contract Verification & Build",
      required: true,
      requirements: { codeBlock: true, packageManagerCommands: true },
    },
    { id: "license", heading: "License", required: true },
  ],
  preferredSectionOrder: [
    "identity",
    "overview",
    "features",
    "installation",
    "workflow-setup",
    "standalone-examples",
    "environment-variables",
    "subpath-exports",
    "verification-build",
    "license",
  ],
  requiredSectionIds: [
    "identity",
    "overview",
    "features",
    "installation",
    "workflow-setup",
    "standalone-examples",
    "environment-variables",
    "subpath-exports",
    "license",
  ],
  recommendedSectionIds: ["verification-build"],
};

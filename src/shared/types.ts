/** Requirements that a README section's content must satisfy. */
type DocumentationRequirement = {
  /** Whether the section must contain a fenced code block. */
  codeBlock?: boolean;
  /** Whether the section must include a package-manager command. */
  packageManagerCommands?: boolean;
  /** Whether the section must document public entrypoints. */
  publicEntryPoints?: boolean;
  /** Whether the section must include a WCAG reference. */
  wcagReference?: boolean;
};

/** A named README section and the rules associated with it. */
type DocumentationSection = {
  /** Stable identifier used by validation diagnostics and ordering rules. */
  id: string;
  /** Expected human-readable heading text. */
  heading: string;
  /** Whether the section must be present in the README. */
  required: boolean;
  /** Alternate heading labels accepted by the validator. */
  aliases?: string[];
  /** Content requirements applied when the section is present. */
  requirements?: DocumentationRequirement;
};

/** Contract defining the required structure of an entrypoint README. */
export type DocumentationContract = {
  /** Package or subpath documented by the README. */
  packageName: string;
  /** Section definitions used to match README headings. */
  sections: DocumentationSection[];
  /** Preferred order for matched section identifiers. */
  preferredSectionOrder: string[];
  /** Section identifiers that must be present. */
  requiredSectionIds: string[];
  /** Section identifiers recommended but not mandatory. */
  recommendedSectionIds: string[];
};

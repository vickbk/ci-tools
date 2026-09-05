import "eslint-import-resolver-typescript";
import boundaries from "eslint-plugin-boundaries";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  // 1. Global Ignores
  globalIgnores([
    "out/**",
    "build/**",
    "dist/",
    "coverage/",
    "playwright-report/",
    "test-results/",
  ]),

  // 2. Base TypeScript Recommended Rules
  ...tseslint.configs.recommended,

  // 3. Project Architecture Boundaries (Applies to ALL files)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      boundaries,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        "eslint-import-resolver-typescript": {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },

      "boundaries/elements": [
        {
          type: "src-bin",
          pattern: ["src/bin/*", "src/bin/**", "src/bin/*/**"],
        },
        {
          type: "src-config",
          pattern: ["src/config/*", "src/config/**", "src/config/*/**"],
        },
        {
          type: "src-core",
          pattern: ["src/core/*", "src/core/*/**"],
          capture: ["src-core-name"],
        },
        {
          type: "src-feat",
          pattern: ["src/features/*", "src/features/**", "src/features/*/**"],
          capture: ["src-feat-name"],
        },
        {
          type: "src-shared",
          pattern: ["src/shared/*", "src/shared/**", "src/shared/*/**"],
        },
        {
          type: "tests",
          pattern: "tests/**", // Fixed to properly capture files inside root tests folder
        },
        // Fallbacks for root level items
        { type: "src", pattern: "src/**" },
      ],
    },

    rules: {
      "@typescript-eslint/no-use-before-define": [
        "warn",
        { functions: false, classes: true, variables: true },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-shadow": "warn",

      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "src-feat" } },
              disallow: { to: { element: { type: "src-feat" } } },
              message:
                'Cross-feature contamination: Automation feature "{{from.captured.src-feat-name}}" cannot cross-import feature "{{to.captured.src-feat-name}}".',
            },

            {
              from: { element: { type: "src-core" } },
              disallow: { to: { element: { type: "src-core" } } },
              message:
                'Cross-core automation contamination: "{{from.captured.src-core-name}}" cannot import from execution helper "{{to.captured.src-core-name}}".',
            },

            {
              from: { element: { type: "src-config" } },
              disallow: [
                { to: { element: { type: "src-bin" } } },
                { to: { element: { type: "src-feat" } } },
                { to: { element: { type: "src-core" } } },
              ],
              message:
                "Layer Violation: Task runtime config must remain isolated and self-contained.",
            },
            {
              from: { element: { type: "src-shared" } },
              disallow: [
                { to: { element: { type: "src-bin" } } },
                { to: { element: { type: "src-feat" } } },
                { to: { element: { type: "src-core" } } },
                { to: { element: { type: "src-config" } } },
              ],
              message:
                "Layer Violation: Shared utility scripts cannot depend on core tasks or features.",
            },
            {
              from: { element: { type: "src-core" } },
              disallow: [
                { to: { element: { type: "src-feat" } } },
                { to: { element: { type: "src-bin" } } },
              ],
              message:
                "Layer Violation: Global automation infrastructure cannot depend on task implementations or binary entrypoints.",
            },
          ],
        },
      ],
    },
  },

  // This explicitly EXCLUDES test files so they remain free to import test infrastructure.
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/__tests__/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["tests/*", "tests/**", "**/tests/**", "../**/tests/**"],
              message:
                "Leak Alert: Production application files are not allowed to import testing infrastructure tools or configurations.",
            },
          ],
        },
      ],
    },
  },
]);

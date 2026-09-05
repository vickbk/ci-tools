# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.1.1] - 2026-09-05

### Info

- **Improved documentation for onboarding**: Added examples to the readme for showing how to easily get started

## [0.1.0] - 2026-09-05

### Added

- **Core & GitHub Module (`@vickbk/ci-tools/github`, `@vickbk/ci-tools/core`)**:
  - CI environment parsing for pull requests, workflow runs, commit references, and repository contexts.
  - GitHub REST API helpers for posting, updating, and deduplicating pull-request comments.
  - Process-aware CLI task and fatal-error orchestration for executable workflow scripts.
- **Docs Module (`@vickbk/ci-tools/docs`)**:
  - Automated README documentation section contract validation.
  - Structured diagnostics for missing sections and ordering violations.
  - Automated comment formatting and posting for pull-request README drift detection.
- **Releases Module (`@vickbk/ci-tools/releases`)**:
  - Release-note extraction for targeted versions from Markdown changelogs.
  - Version normalization, package-version validation, and npm dist-tag resolution.
- **Vitest Module (`@vickbk/ci-tools/vitest`)**:
  - Vitest coverage summary parsing and report generation.
  - Formatting of coverage metrics into workflow summaries and pull-request comments.
- **Shared Utilities & Configuration (`@vickbk/ci-tools`)**:
  - Filesystem and path-resolution helpers, including asynchronous and synchronous text-file operations.
  - Centralized schema-validated configuration loading for CI environments.
- **Packaging & Dual Module Support**:
  - Dual ESM (`.mjs`) and CJS (`.cjs`) bundles with TypeScript declarations (`.d.mts`, `.d.cts`) generated via `tsdown`.
  - Export subpaths for granular, tree-shakable consumer imports.

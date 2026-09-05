## Action Plan: `@vickbk/ci-tools` NPM Publication Readiness

### Phase 1: Build & Package Metadata Alignment

- [x] **Task 1: Align `package.json` Exports with Compiled Dist Output**
- **Status**: ✅ Completed
- **Target**: 2026-09-07
- **Description**: Fix `package.json` entrypoints and subpath exports so they point exclusively to compiled `dist/` artifacts (`.mjs`, `.cjs`, `.d.mts`) rather than raw `src/` TypeScript files.
- **Steps**:
- [x] Update `package.json` root `main`, `module`, and `types` fields to point to compiled dist targets.
- [x] Update all `exports` entries (`.`, `./core`, `./docs`, `./github`, `./releases`, `./vitest`) in `package.json` to map their `import`, `require`, and `types` conditions to generated files in `dist/`.
- [x] Configure the `files` array in `package.json` to include only `["dist", "README.md", "LICENSE", "CHANGELOG.md"]`.

- [x] **Task 2: Configure `tsdown` Build Pipeline for All Subpath Targets**
- **Status**: ✅ Completed
- **Target**: 2026-09-07
- **Description**: Ensure `tsdown.config.ts` compiles all 6 entrypoints (root + 5 subpaths) and generates matching CJS, ESM, and TypeScript declaration outputs into `dist/`.
- **Steps**:
- [x] Verify `tsdown.config.ts` includes entrypoints for `src/index.ts`, `src/core/index.ts`, `src/features/docs/index.ts`, `src/core/github/index.ts`, `src/features/releases/index.ts`, and `src/features/vitest/index.ts`.
- [x] Enable clean output builds and declaration generation (`dts: true`) in `tsdown.config.ts`.
- [x] Execute `pnpm build` and verify all target bundles and declaration files exist under `dist/`.

---

### Phase 2: Public Type Exports & API Surface Harmonization

- [x] **Task 3: Expose Missing Contract Types in Subpath Barrels**
- **Status**: ✅ Completed
- **Target**: 2026-09-08
- **Description**: Audit and re-export all domain contract types, interfaces, options, and error classes through their respective subpath barrel files (`index.ts`).
- **Steps**:
- [x] Re-export `DocumentationContract`, section result shapes, and validation options from `src/features/docs/index.ts`.
- [x] Re-export `CoverageReport`, `CoverageSummaryJson`, and formatting options from `src/features/vitest/index.ts`.
- [x] Re-export release options, version contract interfaces, and changelog types from `src/features/releases/index.ts`.
- [x] Re-export GitHub options, comment parameters, and environment payload types from `src/core/github/index.ts`.

- [x] **Task 4: Harmonize Root Barrel (`src/index.ts`) Re-Exports**
- **Status**: ✅ Completed
- **Target**: 2026-09-08
- **Description**: Ensure the root package entrypoint (`@vickbk/ci-tools`) cleanly re-exports functions and types from all subpaths without name collisions or missing contracts.
- **Steps**:
- [x] Audit `src/index.ts` to ensure full coverage of `core`, `docs`, `github`, `releases`, and `vitest` public APIs.
- [x] Verify that importing from `@vickbk/ci-tools` resolves both functions and TypeScript interfaces cleanly.

---

### Phase 3: Documentation Contracts, READMEs & Public JSDoc

- [x] **Task 5: Define README Documentation Contracts & Wire Validation**
- **Status**: ✅ Completed
- **Target**: 2026-09-09
- **Description**: Define `DocumentationContract` configurations for the root and all subpath entrypoints (`./core`, `./docs`, `./github`, `./releases`, `./vitest`) in code, and register them in the `checkReadmeFiles` / `bin/readme-check` task runner.
- **Steps**:
  - [x] Define contract objects matching `DocumentationContract` for `./` and each subpath entrypoint, setting required section IDs, heading aliases, preferred section order, and `DocumentationRequirement` flags (e.g., `packageManagerCommands`, `publicEntryPoints`).
  - [x] Wire contract configurations into `bin/readme-check` so running `pnpm readme-check` validates all entrypoint READMEs.
  - [x] Run `pnpm readme-check` to verify the runner executes contract validation across all target paths.

- [x] **Task 6: Author Root & Subpath READMEs to Satisfy Contracts**
- **Status**: ✅ Completed
- **Target**: 2026-09-09
- **Description**: Write consumer-facing `README.md` files for the root package and subpaths to satisfy their defined `DocumentationContract` rules.
- **Steps**:
  - [x] Write root `README.md` with installation commands, architecture summary, subpath table, and runnable examples.
  - [x] Ensure all required sections, headings, code blocks, and package manager commands match their contracts.
  - [x] Run `pnpm readme-check` and confirm 0 contract validation failures.

- [x] **Task 7: Document CLI Execution Boundaries & Enrich Public JSDoc**
- **Status**: ✅ Completed
- **Target**: 2026-09-09
- **Description**: Document the boundary between pure SDK utilities and process-aware CLI lifecycle helpers, and add JSDoc annotations to public barrel functions.
- **Steps**:
  - [x] Add explicit JSDoc annotations to `runTask` and `handleFatalError` stating they are CLI orchestrators managing process exit codes.
  - [x] Add JSDoc comments (`@param`, `@returns`, `@throws`) across all exported functions in public barrel (`index.ts`) files.
  - [x] **Task 7.1: Resolve Audit Findings for Undocumented & Incomplete Exports**
  - **Status**: ✅ Done
  - **Target**: 2026-09-09
  - **Description**: Address all documentation gaps and missing JSDoc tags identified in the codebase audit across `src/shared`, `readme-contract.ts` files, domain types, internal feature utilities, and configuration modules.
  - **Steps**:
    - [x] Add complete JSDoc annotations (`@param`, `@returns`, `@throws`, `@example`) to all shared utilities in `src/shared/` (`createTextFileAsync`, `createTextFileSync`, `getPathFlag`, `getFullPath`, `isNotFoundError`, `readJsonFile`, `readTextFileAsync`, `readTextFileSync`, `readTextFile`, `normalizePath`).
    - [x] Add property-level inline JSDoc comments to domain contract/result types in `src/core/types.ts`, `src/features/docs/types.ts`, `src/features/releases/types.ts`, `src/features/vitest/types.ts`, `src/shared/types.ts`, and `src/config/get-config.ts`.
    - [x] Add JSDoc header annotations to all 6 co-located `readme-contract.ts` constants.
    - [x] Update internal utility function JSDoc in `src/features/docs/` (`getErrorLogContent`, `getPreviousAndCurrentSection`), `src/features/releases/` (`extractReleaseNotes`), and `src/config/` (`getConfig`).
    - [x] Run `pnpm typecheck && pnpm build` to verify clean compilation with zero runtime or contract regressions.

---

### Phase 4: Pre-Release Packaging Validation & Dry-Run Audit

- [ ] **Task 8: Execute Dry-Run Tarball Inspection (`pnpm pack`)**
- **Status**: ⏳ Pending
- **Target**: 2026-09-10
- **Description**: Run a package tarball dry-run to confirm that raw `src/`, `tests/`, and internal configurations are excluded from the published payload.
- **Steps**:
- [ ] Execute `pnpm pack --dry-run` and inspect the output file list.
- [ ] Confirm the tarball contains **only** `dist/` build outputs, `package.json`, `README.md`, `LICENSE`, and `CHANGELOG.md`.
- [ ] Verify that no `.ts` source files or test files leak into the package tarball.

- [ ] **Task 9: End-to-End Consumer Import Verification**
- **Status**: ⏳ Pending
- **Target**: 2026-09-10
- **Description**: Test installing and importing the packed `.tgz` file into a clean temporary project to verify type resolution and ESM/CJS runtime compatibility.
- **Steps**:
- [ ] Build the package tarball using `pnpm pack`.
- [ ] Install the packed tarball in a temporary directory (`pnpm add /path/to/vickbk-ci-tools-0.1.0.tgz`).
- [ ] Test importing from `@vickbk/ci-tools/docs`, `@vickbk/ci-tools/github`, and `@vickbk/ci-tools/core` in both ESM and CJS Node.js scripts to confirm zero runtime or type errors.

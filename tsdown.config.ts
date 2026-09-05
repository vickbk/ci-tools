import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core/index.ts",
    docs: "src/features/docs/index.ts",
    github: "src/core/github/index.ts",
    releases: "src/features/releases/index.ts",
    vitest: "src/features/vitest/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2025",
  treeshake: true,
  outExtensions({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".mjs" };
  },
});

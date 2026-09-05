import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    alias: {
      "@": path.resolve(import.meta.dirname, "./src/"),
      "#tests": path.resolve(import.meta.dirname, "./tests/"),
    },
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      reporter: ["html", "text", "json", "json-summary"],
    },
  },
});

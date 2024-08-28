/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "app/index.html"),
        authenticate: resolve(__dirname, "authenticate/index.html"),
        options: resolve(__dirname, "options/index.html")
      }
    },
    target: "esnext"
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true
  }
});

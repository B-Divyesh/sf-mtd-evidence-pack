import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    sourcemap: true,
    manifest: "asset-manifest.json",
    rollupOptions: {
      output: { manualChunks: { zip: ["@zip.js/zip.js"] } }
    }
  }
});

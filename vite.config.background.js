import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
        "@": path.resolve(__dirname, "./src/")
    }},
    build: {
        outDir: "dist/background",
        rollupOptions: {
            input: "src/background/background.ts",
            output: {
                inlineDynamicImports: true,
                entryFileNames: (chunkInfo) => {
                // set the background script in a well known place
                // seperated from other modules
                return "background.js";
            }
        }}
    }
})

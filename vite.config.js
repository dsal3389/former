import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/")
        }
    },
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
              ui: "src/index.html",
              popup: "src/popup/index.html",
            }
        },
    }
})

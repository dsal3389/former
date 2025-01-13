import url from "url";
import path from "path";
import { globSync} from 'glob';
import { defineConfig } from "vite";


export default defineConfig({
    resolve: {
        alias: {
        "@": path.resolve(__dirname, "./src/")
    }},
    build: {
        outDir: "dist/background",
        rollupOptions: {
            input: Object.fromEntries(
                globSync("src/background/**/*.ts").map(file => [
                    path.relative("src/background", file.slice(0, file.length - path.extname(file).length)),
                    url.fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
            output: {
                entryFileNames: "[name].js"
        }}
    }
})

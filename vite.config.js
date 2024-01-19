import { defineConfig } from "vite";

export default defineConfig({
    base: '/svg-tool',
    clearScreen: false,
    build: {
        outDir: 'dist/svg-tool',
        sourcemap: true
    }
})
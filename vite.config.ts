import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    server: {
        port: 10100,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL(".src", import.meta.url)),
            "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
            "@fonts": fileURLToPath(new URL("./src/assets/fonts", import.meta.url)),
            "@icons": fileURLToPath(new URL("./src/assets/icons", import.meta.url)),
            "@comp": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@config": fileURLToPath(new URL("./src/config", import.meta.url)),
            "@mod": fileURLToPath(new URL("./src/modules", import.meta.url)),
            "@store": fileURLToPath(new URL("./src/store", import.meta.url)),
            "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
            "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        },
    },
});

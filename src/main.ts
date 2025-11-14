import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "@router";
import { i18n } from "@loc";

import App from "./App.vue";
import "@styles/style.css";

createApp(App)
    //
    .use(createPinia())
    .use(router)
    .use(i18n)
    .mount("#app");

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Context menu disabled.");
});

window.addEventListener("keydown", (event) => {
    if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        console.log("Page reload prevented.");
    }
});

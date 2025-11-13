import { createApp } from "vue";
import { router } from "@router/index";
import { getLocale, i18n } from "./locales";
import { getTheme, setTheme } from "./modules/themes";

import App from "./App.vue";

import "@styles/style.css";
import { store } from "./store/store";

store.state.language = getLocale();
store.state.theme = await getTheme();
setTheme(store.state.theme);

createApp(App)
    //
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

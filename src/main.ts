import { createApp } from "vue";

import App from "./App.vue";

import "@styles/main.css";

createApp(App).mount("#app");

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

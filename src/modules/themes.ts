import { ref } from "vue";
import { settings } from "./settings";

export enum Theme {
    SYSTEM = "system",
    LIGHT = "light",
    DARK = "dark",
}

export const theme = ref<Theme>(Theme.SYSTEM);

export function setTheme(newTheme: Theme) {
    theme.value = newTheme;

    if (newTheme === Theme.SYSTEM) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        newTheme = prefersDark ? Theme.DARK : Theme.LIGHT;
    }

    document.documentElement.setAttribute("data-theme", newTheme);
}

export async function getTheme(): Promise<Theme> {
    const storedTheme = (await settings.get("theme")) as Theme | null;
    console.log("Stored theme:", storedTheme);
    if (storedTheme && Object.values(Theme).includes(storedTheme)) {
        return storedTheme;
    }
    return Theme.SYSTEM;
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
    if (theme.value !== Theme.SYSTEM) return;
    setTheme(Theme.SYSTEM);
});

export async function saveTheme(theme: Theme) {
    await settings.set("theme", theme);
}

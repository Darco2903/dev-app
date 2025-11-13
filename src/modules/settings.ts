import { load } from "@tauri-apps/plugin-store";

export const settings = await load("settings.json");

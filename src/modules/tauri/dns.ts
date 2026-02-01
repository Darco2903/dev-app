import { invoke } from "@tauri-apps/api/core";
import type { Browser } from "@/types/bindings/Browser";

export async function openUrlInBrowser(browser: Browser, url: string): Promise<void> {
    return invoke("dns_open_url_in_browser", { browser, url });
}

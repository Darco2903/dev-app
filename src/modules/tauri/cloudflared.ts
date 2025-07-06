import { invoke } from "@tauri-apps/api/core";
import type { States } from "@/utils/serviceStates";

export async function status(): Promise<States> {
    return invoke<States>("cloudflared_status");
}

export async function toggle(enable: boolean): Promise<void> {
    return invoke("cloudflared_toggle", { enable });
}

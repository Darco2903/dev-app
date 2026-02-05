import { invoke } from "@tauri-apps/api/core";
import type { States } from "@/types/serviceStates";
import type { CloudflaredStatus } from "@/types/cloudflaredStatus";

export function stateToStatus(state: States): CloudflaredStatus {
    switch (state) {
        case "RUNNING":
            return "running";
        case "STOPPED":
            return "stopped";
        default:
            return "configuration_required";
    }
}

export async function status(): Promise<States> {
    return invoke<States>("cloudflared_status");
}

export async function toggle(enable: boolean): Promise<void> {
    return invoke("cloudflared_toggle", { enable });
}

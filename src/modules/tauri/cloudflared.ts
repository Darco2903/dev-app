import { invoke } from "@tauri-apps/api/core";
import type { States } from "@/utils/serviceStates";

export async function status(): Promise<States> {
    return invoke<States>("status");
}

export async function start(): Promise<void> {
    return invoke("start");
}

export async function stop(): Promise<void> {
    return invoke("stop");
}

import { invoke } from "@tauri-apps/api/core";

export type UniServerzInfo = {
    name: string;
    apache: boolean;
    mysql: boolean;
};

export async function init_uni(name: string, path: string): Promise<void> {
    return invoke("init_uni", { name, path });
}

export async function unset_uni(): Promise<void> {
    return invoke("unset_uni");
}

export async function info(): Promise<UniServerzInfo> {
    return invoke("uniserverz_info");
}

export async function toggleBoth(enable: boolean): Promise<void> {
    return invoke("uniserverz_toggle_both", { enable });
}

export async function toggleApache(enable: boolean): Promise<void> {
    return invoke("uniserverz_toggle_apache", { enable });
}

export async function toggleMysql(enable: boolean): Promise<void> {
    return invoke("uniserverz_toggle_mysql", { enable });
}

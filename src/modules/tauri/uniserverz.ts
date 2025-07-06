import { invoke } from "@tauri-apps/api/core";

type UniServerzInfo = {
    name: string;
    apache: boolean;
    mysql: boolean;
};

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

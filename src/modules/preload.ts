import { store } from "@store/store";
import { status as cloudflaredStatus } from "@mod/tauri/cloudflared";
import { dns_list_dev } from "@mod/tauri/cloudflare";
import { info as UniInfo } from "@mod/tauri/uniserverz";
import { getTheme, setTheme } from "@mod/themes";
import { getLocale } from "@loc/index";

const state = store.state;

export async function preload() {
    const pCloudflaredStatus = cloudflaredStatus()
        .catch((err) => {
            console.error("Error fetching tunnel status:", err);
            return "Error";
        })
        .then((status) => {
            state.tunnelStatus = status;
            state.theme;
            console.log("Tunnel status:", state.tunnelStatus);
        });

    const pUniInfo = UniInfo()
        .catch((err) => {
            console.error("Error fetching UniServerZ info:", err);
            return { name: "Unknown", apache: false, mysql: false };
        })
        .then((info) => {
            state.dbInfo = info;
            console.log("UniServerZ Info:", state.dbInfo);
        });

    const pDnsListDev = dns_list_dev()
        .catch((err) => {
            console.error("Error fetching DNS records:", err);
            return [];
        })
        .then((records) => {
            state.dnsRecords = records;
            console.log("DNS Records:", state.dnsRecords);
        });

    await Promise.all([pCloudflaredStatus, pUniInfo, pDnsListDev]);
}

import { defineStore } from "pinia";
import { getLocale, Locale } from "@loc";
import type { DnsRecordType } from "@/types/bindings/DnsRecordType";
import { dns_list_dev } from "@mod/tauri/cloudflare";
import { status as cloudflaredStatus } from "@mod/tauri/cloudflared";
import { info as UniInfo, type UniServerzInfo } from "@mod/tauri/uniserverz";
import { getTheme, setTheme, Theme } from "@mod/themes";

export const useStore = defineStore("main", {
    state: () => ({
        theme: Theme.SYSTEM as Theme,
        language: Locale.EN as Locale,
        tunnelStatus: "Initializing" as string,
        dbInfo: {
            name: "",
            apache: false,
            mysql: false,
        } as UniServerzInfo,
        dnsRecords: [] as DnsRecordType[],
    }),
    actions: {
        async preload() {
            this.language = getLocale();
            const pTheme = getTheme().then((theme) => {
                setTheme(theme);
                this.theme = theme;
            });

            const pCloudflaredStatus = cloudflaredStatus().then((status) => {
                this.tunnelStatus = status;
                console.log("Tunnel status:", this.tunnelStatus);
            });
            const pUniInfo = UniInfo().then((info) => {
                this.dbInfo = info;
                console.log("UniServerZ Info:", this.dbInfo);
            });
            const pDnsListDev = dns_list_dev().then((records) => {
                this.dnsRecords = records;
                console.log("DNS Records:", this.dnsRecords);
            });
            await Promise.all([pTheme, pCloudflaredStatus, pUniInfo, pDnsListDev]);
        },
    },
});

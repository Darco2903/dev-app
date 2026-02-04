import { readonly, ref, watch } from "vue";
import { defineStore } from "pinia";
import { getLocale, Locale } from "@loc";
import type { DnsRecordType } from "@/types/bindings/DnsRecordType";
import { dns_list_dev } from "@mod/tauri/cloudflare";
import { status as cloudflaredStatus, stateToStatus } from "@mod/tauri/cloudflared";
import { info as UniInfo, type UniServerzInfo } from "@mod/tauri/uniserverz";
import { getTheme, setTheme, Theme } from "@mod/themes";
import { useConfigStore } from "./config";
import type { CloudflaredStatus } from "@/types/cloudflaredStatus";

export const useMainStore = defineStore("main", () => {
    const preloading = ref<boolean>(true);
    const theme = ref<Theme>(Theme.SYSTEM);
    const language = ref<Locale>(Locale.EN);
    const tunnelStatus = ref<CloudflaredStatus>("initializing");
    const dbInfo = ref<UniServerzInfo>({
        name: "",
        apache: false,
        mysql: false,
    });
    const dnsRecords = ref<DnsRecordType[]>([]);

    const configStore = useConfigStore();

    watch([() => configStore.isOk, () => preloading.value], ([isOk, preloadingValue]) => {
        if (!isOk) {
            tunnelStatus.value = "configuration_required";
            dbInfo.value = {
                name: "",
                apache: false,
                mysql: false,
            };
            dnsRecords.value = [];
        }
    });

    async function preload() {
        language.value = getLocale();
        const pTheme = getTheme().then((t) => {
            setTheme(t);
            theme.value = t;
        });

        await Promise.all([pTheme]);
        preloading.value = false;
    }

    async function preload2() {
        tunnelStatus.value = "initializing";

        const pCloudflaredStatus = cloudflaredStatus().then((status) => {
            tunnelStatus.value = stateToStatus(status);
            console.log("Tunnel status:", tunnelStatus.value);
        });

        const pUniInfo = UniInfo().then((info) => {
            dbInfo.value = info;
            console.log("UniServerZ Info:", dbInfo.value);
        });

        const pDnsListDev = dns_list_dev().then((records) => {
            dnsRecords.value = records;
            console.log("DNS Records:", dnsRecords.value);
        });

        await Promise.all([pCloudflaredStatus, pUniInfo, pDnsListDev]);
    }

    return {
        // state
        preloading: readonly(preloading),
        theme,
        language,
        tunnelStatus: readonly(tunnelStatus),
        dbInfo: dbInfo,
        dnsRecords: readonly(dnsRecords),

        // actions
        preload,
        preload2,
    };
});

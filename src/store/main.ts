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
import type { States } from "@/types/serviceStates";

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

    setInterval(() => {
        console.log("tunnelStatus:", tunnelStatus.value);
    }, 500);

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

        await Promise.all([
            //
            updateTunnelStatus(),
            updateDbInfo(),
            updateDnsRecords(),
        ]);
    }

    async function updateTunnelStatus() {
        const status: States = await cloudflaredStatus().catch(() => "ERROR");
        tunnelStatus.value = stateToStatus(status);
        console.log("Updated Tunnel status:", tunnelStatus.value);
    }

    async function updateDbInfo() {
        dbInfo.value = await UniInfo().catch(() => ({
            name: "",
            apache: false,
            mysql: false,
        }));
        console.log("Updated UniServerZ Info:", dbInfo.value);
    }

    async function updateDnsRecords() {
        dnsRecords.value = await dns_list_dev().catch(() => []);
        console.log("Updated DNS Records:", dnsRecords.value);
    }

    return {
        // state
        preloading: readonly(preloading),
        theme,
        language,
        tunnelStatus,
        dbInfo: readonly(dbInfo),
        dnsRecords: readonly(dnsRecords),

        // actions
        preload,
        preload2,
        updateTunnelStatus,
        updateDbInfo,
        updateDnsRecords,
    };
});

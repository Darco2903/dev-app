import { computed, readonly, ref, watch } from "vue";
import { defineStore } from "pinia";
import { settings } from "@mod/settings";
import { init_cloudflare, unset_cloudflare } from "@mod/tauri/cloudflare";
import { init_uni, unset_uni } from "@mod/tauri/uniserverz";
import { useMainStore } from "./main";
import {
    CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ZONE_ID,
    UNISERVERZ_NAME,
    UNISERVERZ_PATH,
} from "@mod/consts";

export const useConfigStore = defineStore("config", () => {
    const configLoaded = ref<boolean>(false);
    const configError = ref<boolean>(false);

    const cloudflareApiToken = ref<string>("");
    const cloudflareZoneId = ref<string>("");
    const uniName = ref<string>("");
    const uniPath = ref<string>("");

    const cloudflareApiTokenOld = ref<string>("");
    const cloudflareZoneIdOld = ref<string>("");
    const uniNameOld = ref<string>("");
    const uniPathOld = ref<string>("");

    const mainStore = useMainStore();

    const isDirty = computed<boolean>(() => {
        return (
            cloudflareApiToken.value !== cloudflareApiTokenOld.value ||
            cloudflareZoneId.value !== cloudflareZoneIdOld.value ||
            uniName.value !== uniNameOld.value ||
            uniPath.value !== uniPathOld.value
        );
    });

    const isConfigured = computed<boolean>(() => {
        return (
            cloudflareApiToken.value.length > 0 &&
            cloudflareZoneId.value.length > 0 &&
            uniName.value.length > 0 &&
            uniPath.value.length > 0
        );
    });

    const isOk = computed<boolean>(() => {
        return configLoaded.value && !configError.value && isConfigured.value;
    });

    async function loadConfig(): Promise<void> {
        if (!isConfigured.value) {
            throw new Error("Configuration is incomplete.");
        }

        console.log("Loading config...");
        configLoaded.value = false;
        configError.value = false;

        await Promise.all([
            init_cloudflare(cloudflareApiToken.value, cloudflareZoneId.value),
            init_uni(uniName.value, uniPath.value),
        ]);

        configLoaded.value = true;
        console.log("Config loaded.");

        await mainStore.preload2();
        console.log("Preload complete.");
    }

    async function unsetConfig(): Promise<void> {
        console.log("Unsetting config...");
        configLoaded.value = false;
        configError.value = false;

        await Promise.all([
            //
            unset_cloudflare(),
            unset_uni(),
        ]);
        console.log("Config unset.");
    }

    function updateOlds() {
        cloudflareApiTokenOld.value = cloudflareApiToken.value;
        cloudflareZoneIdOld.value = cloudflareZoneId.value;
        uniNameOld.value = uniName.value;
        uniPathOld.value = uniPath.value;
    }

    function resetToOlds() {
        cloudflareApiToken.value = cloudflareApiTokenOld.value;
        cloudflareZoneId.value = cloudflareZoneIdOld.value;
        uniName.value = uniNameOld.value;
        uniPath.value = uniPathOld.value;
    }

    async function init() {
        await Promise.all([
            settings.get<string>(CLOUDFLARE_API_TOKEN).then((res) => {
                if (res !== undefined) {
                    cloudflareApiToken.value = res;
                }
            }),

            settings.get<string>(CLOUDFLARE_ZONE_ID).then((res) => {
                if (res !== undefined) {
                    cloudflareZoneId.value = res;
                }
            }),

            settings.get<string>(UNISERVERZ_NAME).then((res) => {
                if (res !== undefined) {
                    uniName.value = res;
                }
            }),

            settings.get<string>(UNISERVERZ_PATH).then((res) => {
                if (res !== undefined) {
                    uniPath.value = res;
                }
            }),
        ]);

        updateOlds();
    }

    async function saveConfig() {
        const ps: Promise<void>[] = [];

        if (cloudflareApiToken.value.length > 0) {
            ps.push(settings.set(CLOUDFLARE_API_TOKEN, cloudflareApiToken.value));
        } else {
            ps.push(settings.delete(CLOUDFLARE_API_TOKEN).then(() => undefined));
        }

        if (cloudflareZoneId.value.length > 0) {
            ps.push(settings.set(CLOUDFLARE_ZONE_ID, cloudflareZoneId.value));
        } else {
            ps.push(settings.delete(CLOUDFLARE_ZONE_ID).then(() => undefined));
        }

        if (uniName.value.length > 0) {
            ps.push(settings.set(UNISERVERZ_NAME, uniName.value));
        } else {
            ps.push(settings.delete(UNISERVERZ_NAME).then(() => undefined));
        }

        if (uniPath.value.length > 0) {
            ps.push(settings.set(UNISERVERZ_PATH, uniPath.value));
        } else {
            ps.push(settings.delete(UNISERVERZ_PATH).then(() => undefined));
        }

        await Promise.all(ps);
        await Promise.all([
            settings.save(),
            (isConfigured.value ? loadConfig() : unsetConfig()).catch((err) => {
                console.error("Error applying configuration:", err);
                configError.value = true;
            }),
        ]);

        updateOlds();
    }

    return {
        // states
        cloudflareApiToken,
        cloudflareZoneId,
        uniName,
        uniPath,
        isDirty: readonly(isDirty),
        configLoaded: readonly(configLoaded),
        configError,
        isConfigured: readonly(isConfigured),
        isOk: readonly(isOk),

        // actions
        init,
        loadConfig,
        saveConfig,
        unsetConfig,
        
        resetToOlds,
    };
});

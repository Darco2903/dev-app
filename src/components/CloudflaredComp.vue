<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { wait } from "@darco2903/web-common";
import { useMainStore } from "@store/main";
import * as cloudflared from "@mod/tauri/cloudflared";
import type { States } from "@/types/serviceStates";

const { t } = useI18n();
const mainStore = useMainStore();

const busy = ref<boolean>(false);
const refreshBusy = ref<boolean>(false);

async function status(): Promise<void> {
    refreshBusy.value = true;
    await Promise.all([
        //
        mainStore.updateTunnelStatus(),
        wait(1000),
    ]);
    refreshBusy.value = false;
}

async function toggleTunnel(enable: boolean): Promise<void> {
    if (busy.value) {
        console.warn("Toggle operation is already in progress.");
        return;
    }

    busy.value = true;
    await cloudflared
        .toggle(enable)
        .then(async () => {
            let attempts = 0;
            let status;
            const maxAttempts = 5; // Limit to avoid infinite loop
            const expectedStatus: States = enable ? "RUNNING" : "STOPPED";

            mainStore.tunnelStatus = enable ? "starting" : "stopping";

            do {
                await wait(500);
                // await this.status();

                status = await cloudflared.status();
            } while (status !== expectedStatus && attempts++ < maxAttempts);

            mainStore.tunnelStatus = cloudflared.stateToStatus(status);

            if (status !== expectedStatus) {
                console.warn(
                    `Tunnel did not reach expected status: ${expectedStatus} after ${attempts} attempts. Current status: ${status}`,
                );
            } else {
                console.log(`Tunnel successfully reached expected status: ${expectedStatus}`);
            }
        })
        .catch((err) => {
            console.error("Error toggling tunnel:", err);
        });
    busy.value = false;
}
</script>

<template>
    <div class="cloudflared-container">
        <h2 class="text">{{ t("cloudflared.title") }}</h2>

        <div class="content">
            <div class="container">
                <button class="usr-btn" @click="status" :disabled="busy || refreshBusy">
                    {{ t("common.refresh.refresh") }}
                </button>
                <p class="text" style="font-weight: 500">
                    {{ t(`cloudflared.tunnelStatus.${mainStore.tunnelStatus}`) }}
                </p>
            </div>

            <div class="container">
                <button
                    class="usr-btn"
                    @click="toggleTunnel(false)"
                    :disabled="busy || mainStore.tunnelStatus == 'stopped'"
                >
                    {{ t("cloudflared.stopTunnel") }}
                </button>
                <button
                    class="usr-btn"
                    @click="toggleTunnel(true)"
                    :disabled="busy || mainStore.tunnelStatus == 'running'"
                >
                    {{ t("cloudflared.startTunnel") }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
</style>

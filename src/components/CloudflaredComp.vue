<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { wait } from "@darco2903/web-common";
import { useStore } from "@store";
import * as cloudflared from "@mod/tauri/cloudflared";

const store = useStore();
const { t } = useI18n();

const busy = ref<boolean>(false);
const refreshBusy = ref<boolean>(false);

async function status(): Promise<void> {
    refreshBusy.value = true;
    const p1 = cloudflared
        .status()
        .catch((err) => {
            console.error("Error fetching tunnel status:", err);
            return "Error";
        })
        .then((status) => {
            store.tunnelStatus = status;
        });
    const p2 = wait(1000);
    await Promise.all([p1, p2]);
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
            const expectedStatus = enable ? "RUNNING" : "STOPPED";

            store.tunnelStatus = enable ? "Starting" : "Stopping";

            do {
                await wait(500);
                // await this.status();

                status = await cloudflared.status();
            } while (status !== expectedStatus && attempts++ < maxAttempts);

            store.tunnelStatus = status;

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
                    {{ t(`cloudflared.tunnelStatus.${store.tunnelStatus.toLowerCase()}`) }}
                </p>
            </div>

            <div class="container">
                <button
                    class="usr-btn"
                    @click="toggleTunnel(false)"
                    :disabled="busy || store.tunnelStatus == 'STOPPED'"
                >
                    {{ t("cloudflared.stopTunnel") }}
                </button>
                <button
                    class="usr-btn"
                    @click="toggleTunnel(true)"
                    :disabled="busy || store.tunnelStatus == 'RUNNING'"
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

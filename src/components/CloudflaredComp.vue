<script setup lang="ts">
import { computed, ref } from "vue";
import { wait } from "web-common";
import { store } from "@store/store";
import * as cloudflared from "@mod/tauri/cloudflared";

const state = store.state;

const busy = ref(false);
const refreshBusy = ref(false);

const tunnelStatusPretty = computed(() => {
    return state.tunnelStatus.capitalizeFirstLetter();
});

async function status() {
    refreshBusy.value = true;
    const p1 = cloudflared
        .status()
        .catch((err) => {
            console.error("Error fetching tunnel status:", err);
            return "Error";
        })
        .then((status) => {
            state.tunnelStatus = status;
        });
    const p2 = wait(1000);
    await Promise.all([p1, p2]);
    refreshBusy.value = false;
}

async function toggleTunnel(enable: boolean) {
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

            state.tunnelStatus = enable ? "Starting" : "Stopping";

            do {
                await wait(500);
                // await this.status();

                status = await cloudflared.status();
            } while (status !== expectedStatus && attempts++ < maxAttempts);

            state.tunnelStatus = status;

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
        <h2 class="text">Cloudflared Tunnel</h2>

        <div class="content">
            <div class="container">
                <button class="usr-btn" @click="status" :disabled="busy || refreshBusy">
                    Refresh
                </button>
                <p class="text" style="font-weight: 500">{{ tunnelStatusPretty }}</p>
            </div>

            <div class="container">
                <button
                    class="usr-btn"
                    @click="toggleTunnel(false)"
                    :disabled="busy || state.tunnelStatus == 'STOPPED'"
                >
                    Stop Tunnel
                </button>
                <button
                    class="usr-btn"
                    @click="toggleTunnel(true)"
                    :disabled="busy || state.tunnelStatus == 'RUNNING'"
                >
                    Start Tunnel
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

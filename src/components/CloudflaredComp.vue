<script>
import { wait } from "web-common";
import * as cloudflared from "@mod/tauri/cloudflared";

export default {
    name: "CloudflaredComp",

    data() {
        return {
            tunnelStatus: "Initializing",
            busy: false,
            refreshBusy: false,
        };
    },

    computed: {
        tunnelStatusPretty() {
            return this.tunnelStatus.capitalizeFirstLetter();
        },
    },

    methods: {
        async status() {
            this.refreshBusy = true;
            const p = wait(1000);
            this.tunnelStatus = await cloudflared.status().catch((err) => {
                console.error("Error fetching tunnel status:", err);
                return "Error";
            });

            await p;
            this.refreshBusy = false;
        },

        async toggleTunnel(enable) {
            if (this.busy) {
                console.warn("Toggle operation is already in progress.");
                return;
            }

            this.busy = true;
            await cloudflared
                .toggle(enable)
                .then(async () => {
                    let attempts = 0;
                    let status;
                    const maxAttempts = 5; // Limit to avoid infinite loop
                    const expectedStatus = enable ? "RUNNING" : "STOPPED";

                    this.tunnelStatus = enable ? "Starting" : "Stopping";

                    do {
                        await wait(500);
                        // await this.status();

                        status = await cloudflared.status();
                    } while (status !== expectedStatus && attempts++ < maxAttempts);

                    this.tunnelStatus = status;

                    if (status !== expectedStatus) {
                        console.warn(
                            `Tunnel did not reach expected status: ${expectedStatus} after ${attempts} attempts. Current status: ${status}`,
                        );
                    } else {
                        console.log(
                            `Tunnel successfully reached expected status: ${expectedStatus}`,
                        );
                    }
                })
                .catch((err) => {
                    console.error("Error toggling tunnel:", err);
                });
            this.busy = false;
        },
    },

    async mounted() {
        await this.status();
        this.$emit("ready");
    },
};
</script>

<template>
    <div class="cloudflared-container">
        <button @click="status" :disabled="busy || refreshBusy">Refresh</button>
        <p>Tunnel Status: {{ tunnelStatusPretty }}</p>
        <button @click="toggleTunnel(true)" :disabled="busy || tunnelStatus == 'RUNNING'">
            Start Tunnel
        </button>
        <button @click="toggleTunnel(false)" :disabled="busy || tunnelStatus == 'STOPPED'">
            Stop Tunnel
        </button>
    </div>
</template>

<style scoped>
/*  */
</style>

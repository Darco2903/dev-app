<script>
import * as cloudflared from "@mod/tauri/cloudflared";

export default {
    name: "CloudflaredComp",

    data() {
        return {
            //
        };
    },

    methods: {
        async status() {
            this.tunnelStatus = await cloudflared.status();
        },

        async startTunnel() {
            //
        },

        async stopTunnel() {
            //
        },
    },
};
</script>

<template>
    <div class="cloudflared-container">
        <button @click="status">Check Tunnel Status</button>
        <p>Tunnel Status: {{ tunnelStatus }}</p>
        <button @click="startTunnel">Start Tunnel</button>
        <button @click="stopTunnel">Stop Tunnel</button>
    </div>
</template>

<style scoped>
/*  */
</style>

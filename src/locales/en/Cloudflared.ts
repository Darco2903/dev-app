import type { Cloudflared } from "../types/Cloudflared";

export default {
    title: "Cloudflared Tunnel",
    startTunnel: "Start Tunnel",
    stopTunnel: "Stop Tunnel",
    tunnelStatus: {
        starting: "Starting",
        running: "Running",
        stopping: "Stopping",
        stopped: "Stopped",
        initializing: "Initializing",
        configuration_required: "Configuration Required",
    },
} satisfies Cloudflared;

import type { Cloudflared } from "../types/Cloudflared";

export default {
    title: "Tunnel Cloudflared",
    startTunnel: "Démarrer",
    stopTunnel: "Arrêter",
    tunnelStatus: {
        starting: "Démarrage",
        running: "Actif",
        stopping: "Arrêt en cours",
        stopped: "Inactif",
        initializing: "Initialisation",
        configuration_required: "Configuration requise",
    },
} satisfies Cloudflared;

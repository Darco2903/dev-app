import type { Cloudflared } from "../types/Cloudflared";

export default {
    title: "Tunnel Cloudflared",
    startTunnel: "Démarrer le tunnel",
    stopTunnel: "Arrêter le tunnel",
    tunnelStatus: {
        starting: "Démarrage",
        running: "Actif",
        stopping: "Arrêt en cours",
        stopped: "Inactif",
    },
} satisfies Cloudflared;

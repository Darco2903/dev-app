export type Cloudflared = {
    title: string;
    startTunnel: string;
    stopTunnel: string;
    tunnelStatus: {
        starting: string;
        running: string;
        stopping: string;
        stopped: string;
        initializing: string;
        configuration_required: string;
    };
};

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
    busy: (busy) => ipcRenderer.invoke("busy", busy),
    unBusy: (busy) => ipcRenderer.invoke("unBusy", busy),
    isBusy: () => ipcRenderer.invoke("isBusy"),
});

contextBridge.exposeInMainWorld("cloudflared", {
    getState: () => ipcRenderer.invoke("getState"),
    toggleTunnel: (enable) => ipcRenderer.invoke("toggleTunnel", enable),
});

contextBridge.exposeInMainWorld("cloudfront", {
    listDistributions: () => ipcRenderer.invoke("listDistributions"),
    toggleDistribution: (id, enable) => ipcRenderer.invoke("toggleDistribution", id, enable),
});

contextBridge.exposeInMainWorld("database", {
    listDatabases: () => ipcRenderer.invoke("listDatabases"),
    onUpdateDatabaseStatus: (callback) => ipcRenderer.on("onUpdateDatabaseStatus", (_event, value) => callback(value)),
    toggleDatabase: (name, type, enable) => ipcRenderer.invoke("toggleDatabase", name, type, enable),
});

contextBridge.exposeInMainWorld("livebox", {
    getPortForwardingRules: () => ipcRenderer.invoke("getPortForwardingRules"),
    togglePortForward: (name, enable) => ipcRenderer.invoke("togglePortForward", name, enable),
});

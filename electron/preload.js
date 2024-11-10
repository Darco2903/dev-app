const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cloudfront", {
    listDistributions: () => ipcRenderer.invoke("listDistributions"),
    toggleDistribution: (id, enable) => ipcRenderer.invoke("toggleDistribution", id, enable),
});

contextBridge.exposeInMainWorld("livebox", {
    getPortForwardingRules: () => ipcRenderer.invoke("getPortForwardingRules"),
    togglePortForward: (name, enable) => ipcRenderer.invoke("togglePortForward", name, enable),
});

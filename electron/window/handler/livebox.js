const { ipcMain } = require("electron");

const { Livebox } = require("livebox");

const { getWindow } = require("../window");

const { username, password } = require("../../../config/livebox.json");

/** @type {import("livebox").Livebox} */
let livebox;

async function initLivebox() {
    livebox = await Livebox.createLivebox(username, password);
}

ipcMain.handle("getPortForwardingRules", async () => {
    if (!livebox) await initLivebox();
    return livebox.portForwardingGetAll();
});

ipcMain.handle("togglePortForward", async (event, name, enable) => {
    if (!livebox) await initLivebox();
    const rule = (await livebox.portForwardingGetAll()).find((rule) => rule.Id === name);
    return livebox.portForwardingToggle(rule.Id, rule.InternalPort, rule.DestinationIPAddress, enable);
});

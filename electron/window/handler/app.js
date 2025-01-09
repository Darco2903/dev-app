const { ipcMain } = require("electron");
const { busy, unBusy, isBusy } = require("../busy");

ipcMain.handle("busy", busy);

ipcMain.handle("unBusy", async (event, id) => {
    unBusy(id);
});

ipcMain.handle("isBusy", isBusy);

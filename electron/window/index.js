// const { app, BrowserWindow, ipcMain, dialog, shell, screen, globalShortcut, WebContentsView } = require("electron");

const { createWindow } = require("./window");

require("./handler/cloudfront");
require("./handler/database");
require("./handler/livebox");

module.exports = {
    createWindow,
};

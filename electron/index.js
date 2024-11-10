const { app, BrowserWindow, ipcMain, dialog, shell, screen, globalShortcut, WebContentsView } = require("electron");

const { createWindow } = require("./window");
const { getWindow } = require("./window/window");

process.env.NODE_ENV = process.argv.includes("dev") ? "development" : "production";

const noInstanceRunning = app.requestSingleInstanceLock();

if (!noInstanceRunning) {
    app.quit();
}

app.on("second-instance", () => {
    getWindow().show();
});

app.on("window-all-closed", async (e) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (process.platform !== "darwin") app.quit();
});

app.on("ready", async () => {
    const window = await createWindow();

    if (process.env.NODE_ENV === "production") {
        // Unregister reload shortcuts
        globalShortcut.register("CommandOrControl+R", () => {});
        globalShortcut.register("CommandOrControl+Shift+R", () => {});
    } else if (process.env.NODE_ENV === "development") {
        console.log("Development mode");
        window.webContents.openDevTools({
            mode: "detach",
        });
    }
});

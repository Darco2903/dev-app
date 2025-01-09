const { ipcMain } = require("electron");
const { exec } = require("child_process");

// const {} = require("../../../config/cloudflared.json");

/**
 * @returns {Promise<import("./cloudflared").STATES>}
 */
async function getState() {
    return new Promise((resolve, reject) => {
        exec(`sc query cloudflared`, (error, stdout, stderr) => {
            if (error) reject(error);
            else {
                const split = stdout
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length);
                const stateLine = split.find((line) => line.startsWith("STATE"));
                const splitLine = stateLine.split(" ").filter((line) => line.length);
                const state = splitLine[splitLine.length - 1];
                resolve(state);
            }
        });
    });
}

async function toggleTunnel(enable) {
    await new Promise((resolve, reject) => {
        const action = enable ? "start" : "stop";
        exec(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c sc ${action} cloudflared' -WindowStyle Hidden"`, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

ipcMain.handle("getState", async () => {
    // console.log("getState");
    return getState();
});

ipcMain.handle("toggleTunnel", async (event, enable) => {
    // console.log("toggleTunnel", enable);
    return toggleTunnel(enable)
        .then(() => true)
        .catch(() => false);
});

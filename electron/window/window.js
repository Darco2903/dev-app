const path = require("path");
const { BrowserWindow, Tray } = require("electron");
const settings = require("electron-settings");

const { APP_ICON, APP_NAME } = require("../../config/app.json");

/** @type {BrowserWindow} */
let window;
/** @type {Tray} */
let tray;

function createSettingsKeys(name) {
    return {
        size: `${name}:windowSize`,
        position: `${name}:windowPosition`,
        maximized: `${name}:windowMaximized`,
    };
}

async function saveWindow(window, name) {
    const settingKeys = createSettingsKeys(name);
    // const size = window.getSize();
    const position = window.getPosition();
    // const maximized = window.isMaximized();
    // await settings.set(settingKeys.size, size);
    await settings.set(settingKeys.position, position);
    // await settings.set(settingKeys.maximized, maximized);
}

async function restoreWindow(window, name) {
    const settingKeys = createSettingsKeys(name);
    const size = await settings.get(settingKeys.size);
    const position = await settings.get(settingKeys.position);
    // const maximized = await settings.get(settingKeys.maximized);
    // console.log("restoring window", size, position, maximized);
    // if (size) window.setSize(...size);
    if (position) window.setPosition(...position);
    // if (maximized) window.maximize();
}

async function createWindow() {
    if (window) throw new Error("Window already exists");

    const icon = path.join(__dirname, "../../", APP_ICON);

    window = new BrowserWindow({
        width: 500,
        height: 600,
        resizable: false,
        maximizable: false,
        // minWidth: 400,
        // minHeight: 600,
        // x: position?.x,
        // y: position?.y,
        autoHideMenuBar: true,
        // transparent: true,
        // frame: false,

        title: APP_NAME,
        icon,
        webPreferences: {
            preload: path.join(__dirname, "../preload.js"),
            devTools: process.env.NODE_ENV === "development",
        },
    });

    const filepath = path.join(__dirname, "../browser/index.html");
    window.loadFile(filepath);

    tray = new Tray(icon);
    tray.on("click", () => {
        if (window.isVisible()) {
            window.focus();
        } else {
            window.show();
        }
    });

    // window.on("resized", async () => await saveWindow(window, "main"));
    // window.on("moved", async () => await saveWindow(window, "main"));
    // window.on("maximize", async () => await saveWindow(window, "main"));
    // window.on("unmaximize", async () => await saveWindow(window, "main"));
    window.on("close", async () => {
        console.log("close main window");
        await saveWindow(window, "main");
        console.log("saved");
    });

    window.on("minimize", async () => {
        window.hide();
    });

    await restoreWindow(window, "main");

    // const [width, height] = window.getSize();

    // const view = new WebContentsView();
    // window.contentView.addChildView(view);
    // view.webContents.loadFile("./browser/main/index.html");
    // view.setBounds({ x: 0, y: 0, width, height });

    // window.on("resize", () => {
    //     const [width, height] = window.getSize();
    //     window.contentView.children.forEach((v) => {
    //         v.setBounds({ x: 0, y: 0, width, height });
    //     });
    // });

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // const view2 = new WebContentsView();
    // window.contentView.addChildView(view2);
    // view2.webContents.loadFile("./browser/settings/index.html");
    // view2.setBounds({ x: width, y: 0, width, height });
    return window;
}

function getWindow() {
    return window;
}

module.exports = {
    createWindow,
    getWindow,
};

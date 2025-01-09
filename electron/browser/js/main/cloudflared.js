const cloudflaredButton = document.getElementById("menu-item-cloudflared");

/**
 * @returns {Promise<import("../../../window/handler/cloudflared").STATES>}
 */
async function getState() {
    let state = await cloudflared.getState();
    while (state !== "RUNNING" && state !== "STOPPED") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        state = await cloudflared.getState();
    }
    return state;
}

/**
 * @param {string} id
 * @param {boolean} enable
 * @returns {Promise<>}
 */
function toggleTunnel(enable) {
    return cloudflared.toggleTunnel(enable);
}

/**
 * @param {import("../../../window/handler/cloudflared").STATES} state
 * @returns {boolean}
 */
function isToggle(state) {
    return state === "RUNNING";
}

window.addEventListener("toggle", async (e) => {
    const id = e.detail.id;
    const button = e.detail.button;

    if (id === "cloudflared") {
        button.toggleAttribute("disabled", true);
        const busy = await app.busy();

        let state = await getState();
        let toggle = isToggle(state);
        // console.log("state", state);

        const succ = await toggleTunnel(!toggle);
        // console.log("succ", succ);

        if (!succ) {
            button.toggleAttribute("error", true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            button.toggleAttribute("error", false);
        }

        state = await getState();
        // console.log("state", state);
        toggle = isToggle(state);
        button.toggleAttribute("toggled", toggle);
        button.toggleAttribute("disabled", false);
        await app.unBusy(busy);
    }
});

window.addEventListener("load", async () => {
    const state = await getState();
    // console.log("state", state);
    const toggle = isToggle(state);
    cloudflaredButton.toggleAttribute("toggled", toggle);
});

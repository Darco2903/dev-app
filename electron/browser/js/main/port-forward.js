const portForwardClone = document.querySelector("#clones .port-forward");
const portForwardContainer = document.getElementById("port-forward-container");

/**
 * @param {Event} event
 */
async function ontTogglePortForward(event) {
    const checkbox = event.target;
    const name = checkbox.dataset.name;
    const enabled = checkbox.checked;
    checkbox.disabled = true;
    const res = await togglePortForward(name, enabled);
    // console.log("res", res);
    // console.log(`Port forward ${name} is now ${enabled ? "enabled" : "disabled"}`);
    checkbox.disabled = false;
}

export function createPortForwardElement(name, enabled, port, ip) {
    /** @type {HTMLDivElement} */
    const elem = portForwardClone.cloneNode(true);
    /** @type {HTMLInputElement} */
    const checkbox = elem.querySelector(".port-forward-enable");
    const parsedName = name.replace("webui_", "");
    checkbox.dataset.name = name;
    checkbox.checked = enabled;
    checkbox.addEventListener("change", ontTogglePortForward);
    elem.querySelector(".port-forward-name").textContent = parsedName;
    elem.querySelector(".port-forward-port").textContent = port;
    elem.querySelector(".port-forward-ip").textContent = ip;
    return elem;
}

export function addPortForwardElement(element) {
    portForwardContainer.appendChild(element);
}

export function clearPortForwardElements() {
    portForwardContainer.innerHTML = "";
}

/**
 * @returns {Promise<import("livebox").PortForwardingRule[]>}
 */
export function getPortForwardingRules() {
    return livebox.getPortForwardingRules();
}

/**
 * @param {string} name
 * @param {boolean} enable
 * @returns {Promise<boolean>}
 */
function togglePortForward(name, enable) {
    return livebox.togglePortForward(name, enable);
}

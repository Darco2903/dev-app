const cloudfrontClone = document.querySelector("#clones .cloudfront");
const cloudfrontContainer = document.getElementById("cloudfront-container");

/**
 * @param {string} id
 * @param {boolean} enable
 * @returns {Promise<import("../../../window/handler/cloudfront").Distribution>}
 */
function toggleCloudfront(id, enable) {
    return cloudfront.toggleDistribution(id, enable);
}

/**
 * @param {Event} event
 */
async function ontToggleCloudfront(event) {
    const checkbox = event.target;
    const id = checkbox.dataset.id;
    const enabled = checkbox.checked;
    checkbox.disabled = true;
    const busy = await app.busy();
    const res = await toggleCloudfront(id, enabled);
    // console.log("res", res);
    // console.log(`Cloudfront ${id} is now ${enabled ? "enabled" : "disabled"}`);
    updateElement(checkbox.closest(".cloudfront"), res.status, res.enabled);
    checkbox.disabled = false;
    await app.unBusy(busy);
}

function updateElement(element, status, enabled) {
    element.querySelector(".cloudfront-status").textContent = status;
    element.querySelector(".cloudfront-enable").checked = enabled;
}

/**
 * @param {string} name
 * @param {string} id
 * @param {string} status
 * @param {boolean} enabled
 * @returns {HTMLDivElement}
 */
export function createCloudfrontElement(name, id, status, enabled) {
    /** @type {HTMLDivElement} */
    const elem = cloudfrontClone.cloneNode(true);
    /** @type {HTMLInputElement} */
    const checkbox = elem.querySelector(".cloudfront-enable");

    checkbox.dataset.id = id;
    checkbox.checked = enabled;
    checkbox.addEventListener("change", ontToggleCloudfront);
    elem.querySelector(".cloudfront-name").textContent = name;
    elem.querySelector(".cloudfront-id").textContent = id;
    elem.querySelector(".cloudfront-status").textContent = status;
    return elem;
}

export function addCloudfrontElement(element) {
    cloudfrontContainer.appendChild(element);
}

export function clearCloudfrontElements() {
    cloudfrontContainer.innerHTML = "";
}

/**
 * @returns {Promise<import("../../../window/handler/cloudfront").Distribution[]>}
 */
export function listDistributions() {
    return cloudfront.listDistributions();
}

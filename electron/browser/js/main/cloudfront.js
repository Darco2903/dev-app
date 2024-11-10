const cloudfrontClone = document.querySelector("#clones .cloudfront");
const cloudfrontContainer = document.getElementById("cloudfront-container");

/**
 * @param {Event} event
 */
async function ontToggleCloudfront(event) {
    const checkbox = event.target;
    const id = checkbox.dataset.id;
    const enabled = checkbox.checked;
    checkbox.disabled = true;
    const res = await toggleCloudfront(id, enabled);
    // console.log("res", res);
    // console.log(`Cloudfront ${id} is now ${enabled ? "enabled" : "disabled"}`);
    checkbox.disabled = false;
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
    const element = cloudfrontClone.cloneNode(true);
    /** @type {HTMLInputElement} */
    const checkbox = element.querySelector(".cloudfront-enable");

    checkbox.dataset.id = id;
    checkbox.checked = enabled;
    checkbox.addEventListener("change", ontToggleCloudfront);
    element.querySelector(".cloudfront-name").textContent = name;
    element.querySelector(".cloudfront-id").textContent = id;
    element.querySelector(".cloudfront-status").textContent = status;
    return element;
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

/**
 * @param {string} id
 * @param {boolean} enable
 * @returns {Promise<boolean>}
 */
function toggleCloudfront(id, enable) {
    return cloudfront.toggleDistribution(id, enable);
}

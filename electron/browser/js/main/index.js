import { initMenuButtons, getMenuButtons } from "./menu.js";
import { addCloudfrontElement, clearCloudfrontElements, createCloudfrontElement, listDistributions } from "./cloudfront.js";
import { addPortForwardElement, clearPortForwardElements, createPortForwardElement, getPortForwardingRules } from "./port-forward.js";
import { wait } from "../utils.js";

const content = document.getElementById("content");
const cloudfrontRefresh = document.getElementById("cloudfront-refresh");
const portForwardRefresh = document.getElementById("port-forward-refresh");

cloudfrontRefresh.addEventListener("click", async () => {
    cloudfrontRefresh.disabled = true;

    const distributions = await listDistributions();
    clearCloudfrontElements();

    distributions.forEach((distribution) => {
        const c = createCloudfrontElement(distribution.name, distribution.id, distribution.status, distribution.enabled);
        addCloudfrontElement(c);
    });

    await wait(1000);
    cloudfrontRefresh.disabled = false;
});

portForwardRefresh.addEventListener("click", async () => {
    portForwardRefresh.disabled = true;

    const rules = await getPortForwardingRules();
    clearPortForwardElements();

    rules.forEach((rule) => {
        const p = createPortForwardElement(rule.Id, rule.Enable, rule.InternalPort, rule.DestinationIPAddress);
        addPortForwardElement(p);
    });

    await wait(1000);
    portForwardRefresh.disabled = false;
});

window.addEventListener("load", async () => {
    initMenuButtons();

    cloudfrontRefresh.click();
    portForwardRefresh.click();
});

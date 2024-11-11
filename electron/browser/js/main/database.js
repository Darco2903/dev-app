const databaseClone = document.querySelector("#clones .database");
const databaseContainer = document.getElementById("database-container");

/**
 * @typedef {Object} databaseStatus
 * @property {string} name
 * @property {boolean} apache
 * @property {boolean} mysql
 */

/**
 * @param {string} name
 * @param {string} type
 * @param {boolean} enable
 * @returns {Promise<boolean>}
 */
function toggleDatabase(name, type, enable) {
    return database.toggleDatabase(name, type, enable);
}

/**
 * @param {Event} event
 */
async function onToggleDatabase(event) {
    const checkbox = event.target;
    const name = checkbox.dataset.name;
    const type = checkbox.dataset.type;
    const enable = checkbox.checked;
    checkbox.disabled = true;
    const res = await toggleDatabase(name, type, enable);
    console.log("res", res);
    console.log(`Database ${name} ${type} is now ${enable ? "enabled" : "disabled"}`);
    // checkbox.disabled = false;
}

database.onUpdateDatabaseStatus(({ name, type, enable }) => {
    console.log("status", name, type, enable);
    const elem = getDatabaseElement(name);
    console.log("elem", elem);

    if (!elem) return;

    const checkbox = elem.querySelector(`.database-${type}`);
    checkbox.checked = enable;
    checkbox.disabled = false;
});

/**
 * @param {string} name
 * @param {boolean} apache
 * @param {boolean} mysql
 * @returns {HTMLDivElement}
 */
export function createDatabaseElement(name, apache, mysql) {
    /** @type {HTMLDivElement} */
    const elem = databaseClone.cloneNode(true);
    /** @type {HTMLInputElement} */
    const apacheCheckbox = elem.querySelector(".database-apache");
    const mysqlCheckbox = elem.querySelector(".database-mysql");

    elem.dataset.name = name;

    apacheCheckbox.dataset.name = name;
    apacheCheckbox.dataset.type = "apache";
    apacheCheckbox.checked = apache;

    mysqlCheckbox.dataset.name = name;
    mysqlCheckbox.dataset.type = "mysql";
    mysqlCheckbox.checked = mysql;

    elem.querySelector(".database-name").textContent = name;
    apacheCheckbox.addEventListener("change", onToggleDatabase);
    mysqlCheckbox.addEventListener("change", onToggleDatabase);
    return elem;
}

function getDatabaseElement(name) {
    return databaseContainer.querySelector(`.database[data-name="${name}"]`);
}

export function addDatabaseElement(element) {
    databaseContainer.appendChild(element);
}

export function clearDatabaseElements() {
    databaseContainer.innerHTML = "";
}

/**
 * @returns {Promise<databaseStatus[]>}
 */
export function listDatabases() {
    return database.listDatabases();
}

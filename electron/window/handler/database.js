const { ipcMain } = require("electron");
const Uni = require("uniserverz");

const { getWindow } = require("../window");

const SERVERS = require("../../../config/uniserverz.json");
// TODO: Check if SERVERS does not contain duplicates names

SERVERS.forEach((s, i, a) => {
    if (a.findIndex((x) => x.name === s.name) !== i) {
        console.warn(`Duplicate server name: ${s.name}`);
    }
});

/** @type {Map<string, Uni>} */
const servers = new Map();

/** @type {Map<string, {type: string, f: Function}[]>} */
const queue = new Map();

async function initUniserverz() {
    const p = SERVERS.map((s) => Uni.createUni(s.PATH, s.EXEC, s.APACHE, s.MYSQL).then((u) => servers.set(s.name, u)));
    await Promise.all(p);
}

ipcMain.handle("listDatabases", async () => {
    if (!servers.size) await initUniserverz();
    return Promise.all(
        servers.entries().map(async ([serverName, u]) => {
            return {
                name: serverName,
                apache: await u.isApacheRunning(),
                mysql: await u.isMysqlRunning(),
            };
        })
    );
});

/**
 * @param {string} serverName
 */
async function processQueue(serverName) {
    const uniserverz = servers.get(serverName);
    const q = queue.get(serverName);

    if (!q.length) {
        queue.delete(serverName);
        return;
    }

    const { type, f } = q.shift();

    await f.bind(uniserverz)();
    processQueue(serverName);

    const enable = type === "apache" ? await uniserverz.isApacheRunning() : await uniserverz.isMysqlRunning();

    getWindow().webContents.send("onUpdateDatabaseStatus", {
        name: serverName,
        type,
        enable,
    });
}

/**
 * @param {string} serverName
 * @param {string} type
 * @param {boolean} enable
 */
function addToQueue(serverName, type, enable) {
    let f;
    const uniserverz = servers.get(serverName);

    if (type === "apache") {
        f = enable ? uniserverz.startApache : uniserverz.stopApache;
    } else if (type === "mysql") {
        f = enable ? uniserverz.startMysql : uniserverz.stopMysql;
    }

    const qElem = { type, f };
    if (queue.has(serverName)) {
        queue.get(serverName).push(qElem);
    } else {
        queue.set(serverName, [qElem]);
        processQueue(serverName);
    }
}

ipcMain.handle("toggleDatabase", async (event, name, type, enable) => {
    const s = SERVERS.find((server) => server.name === name);
    if (!s) {
        console.error(`Server with name ${name} not found`);
        return;
    }

    addToQueue(s.name, type, enable);
});

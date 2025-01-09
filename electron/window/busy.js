const busySet = new Set();

function busy() {
    const id = Math.random().toString(36).substring(7);
    busySet.add(id);
    return id;
}

function isBusy() {
    return busySet.size > 0;
}

function unBusy(id) {
    busySet.delete(id);
}

module.exports = {
    busy,
    isBusy,
    unBusy,
};

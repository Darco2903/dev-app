<script setup lang="ts">
import { computed, ref } from "vue";
import { wait } from "web-common";
import { store } from "@store/store";
import * as uniserverz from "@mod/tauri/uniserverz";

import Checkbox from "@comp/Checkbox.vue";

const state = store.state;

const busy = ref(false);
const refreshBusy = ref(false);

const areBothRunning = computed(() => {
    return state.dbInfo.apache && state.dbInfo.mysql;
});

const areBothStopped = computed(() => {
    return !state.dbInfo.apache && !state.dbInfo.mysql;
});

async function status() {
    refreshBusy.value = true;
    const p = wait(1000);
    state.dbInfo = await uniserverz.info();

    await p;
    refreshBusy.value = false;
}

async function toggleUni(enable: boolean) {
    busy.value = true;
    await uniserverz
        .toggleBoth(enable)
        .then(() => wait(500))
        .then(status)
        .catch((err) => {
            console.error("Error toggling UniServerZ:", err);
        });
    busy.value = false;
}

async function toggleApache(enable: boolean) {
    busy.value = true;
    await uniserverz
        .toggleApache(enable)
        .then(status)
        .catch((err) => {
            console.error("Error toggling Apache:", err);
        });
    busy.value = false;
}

async function toggleMysql(enable: boolean) {
    busy.value = true;
    await uniserverz
        .toggleMysql(enable)
        .then(status)
        .catch((err) => {
            console.error("Error toggling MySQL:", err);
        });
    busy.value = false;
}

const emit = defineEmits<{
    ready: [];
}>();

status().then(() => {
    emit("ready");
});
</script>

<template>
    <div class="uniserverz-container">
        <div class="uniserverz-info flex row">
            <h2 class="text">Database</h2>
            <p class="text" style="font-weight: 500">{{ state.dbInfo.name }}</p>
        </div>

        <div class="content">
            <div>
                <button class="usr-btn" @click="status" :disabled="busy || refreshBusy">
                    Refresh
                </button>
            </div>

            <div class="container both">
                <button
                    class="usr-btn"
                    @click="toggleUni(false)"
                    :disabled="busy || areBothStopped || !areBothRunning"
                >
                    Stop Database
                </button>
                <button
                    class="usr-btn"
                    @click="toggleUni(true)"
                    :disabled="busy || areBothRunning || !areBothStopped"
                >
                    Start Database
                </button>
            </div>

            <div class="container checkboxes">
                <Checkbox
                    class="text"
                    style="font-weight: 500"
                    @change.self="toggleApache"
                    :checked="state.dbInfo.apache"
                    :disabled="busy"
                    >Apache</Checkbox
                >

                <Checkbox
                    class="text"
                    style="font-weight: 500"
                    @change.self="toggleMysql"
                    :checked="state.dbInfo.mysql"
                    :disabled="busy"
                    >MySQL</Checkbox
                >
            </div>
        </div>
    </div>
</template>

<style scoped>
.uniserverz-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.container.checkboxes {
    margin-top: 14px;
    gap: 20px;
}
</style>

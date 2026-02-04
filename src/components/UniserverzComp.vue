<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { wait } from "@darco2903/web-common";
import { useMainStore } from "@store/main";
import * as uniserverz from "@mod/tauri/uniserverz";

import Checkbox from "@comp/Checkbox.vue";

const mainStore = useMainStore();
const { t } = useI18n();

const busy = ref<boolean>(false);
const refreshBusy = ref<boolean>(false);

const areBothRunning = computed<boolean>(() => {
    return mainStore.dbInfo.apache && mainStore.dbInfo.mysql;
});

const areBothStopped = computed<boolean>(() => {
    return !mainStore.dbInfo.apache && !mainStore.dbInfo.mysql;
});

const emit = defineEmits<{
    ready: [];
}>();

async function status(): Promise<void> {
    refreshBusy.value = true;
    const p = wait(1000);
    mainStore.dbInfo = await uniserverz.info();

    await p;
    refreshBusy.value = false;
}

async function toggle(service: "apache" | "mysql" | "both", enable: boolean): Promise<void> {
    busy.value = true;
    let p: Promise<void>;
    if (service === "apache") {
        p = uniserverz.toggleApache(enable);
    } else if (service === "mysql") {
        p = uniserverz.toggleMysql(enable);
    } else {
        p = uniserverz.toggleBoth(enable);
    }

    await p
        //
        .then(() => wait(500))
        .then(status)
        .catch((err) => {
            console.error(`Error toggling UniServerZ ${service}:`, err);
        });
    busy.value = false;
}

status().then(() => {
    emit("ready");
});
</script>

<template>
    <div class="uniserverz-container">
        <div class="uniserverz-info flex row">
            <h2 class="text">{{ t("uniserverz.title") }}</h2>
            <p class="text" style="font-weight: 500">{{ mainStore.dbInfo.name }}</p>
        </div>

        <div class="content">
            <div>
                <button class="usr-btn" @click="status" :disabled="busy || refreshBusy">
                    {{ t("common.refresh.refresh") }}
                </button>
            </div>

            <div class="container both">
                <button
                    class="usr-btn"
                    @click="toggle('both', false)"
                    :disabled="busy || areBothStopped || !areBothRunning"
                >
                    {{ t("uniserverz.stopDatabase") }}
                </button>
                <button
                    class="usr-btn"
                    @click="toggle('both', true)"
                    :disabled="busy || areBothRunning || !areBothStopped"
                >
                    {{ t("uniserverz.startDatabase") }}
                </button>
            </div>

            <div class="container checkboxes">
                <Checkbox
                    class="text"
                    style="font-weight: 500"
                    @change.self="(checked) => toggle('apache', checked)"
                    :checked="mainStore.dbInfo.apache"
                    :disabled="busy"
                    >Apache</Checkbox
                >

                <Checkbox
                    class="text"
                    style="font-weight: 500"
                    @change.self="(checked) => toggle('mysql', checked)"
                    :checked="mainStore.dbInfo.mysql"
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

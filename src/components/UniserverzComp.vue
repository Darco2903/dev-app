<script lang="ts">
import { wait } from "@darco2903/web-common";
import * as uniserverz from "@mod/tauri/uniserverz";

import Checkbox from "@comp/Checkbox.vue";

export default {
    name: "UniserverzComp",

    components: {
        Checkbox,
    },

    data() {
        return {
            name: "",
            apacheStatus: false,
            mysqlStatus: false,
            busy: false,
            refreshBusy: false,
        };
    },

    computed: {
        areBothRunning() {
            return this.apacheStatus && this.mysqlStatus;
        },

        areBothStopped() {
            return !this.apacheStatus && !this.mysqlStatus;
        },
    },

    methods: {
        async status() {
            this.refreshBusy = true;
            const p = wait(1000);
            const info = await uniserverz.info();
            this.name = info.name;
            this.apacheStatus = info.apache;
            this.mysqlStatus = info.mysql;

            await p;
            this.refreshBusy = false;
        },

        async toggleUni(enable: boolean) {
            this.busy = true;
            await uniserverz
                .toggleBoth(enable)
                .then(this.status)
                .catch((err) => {
                    console.error("Error toggling UniServerZ:", err);
                });
            this.busy = false;
        },

        async toggleApache(enable: boolean) {
            this.busy = true;
            await uniserverz
                .toggleApache(enable)
                .then(this.status)
                .catch((err) => {
                    console.error("Error toggling Apache:", err);
                });
            this.busy = false;
        },

        async toggleMysql(enable: boolean) {
            this.busy = true;
            await uniserverz
                .toggleMysql(enable)
                .then(this.status)
                .catch((err) => {
                    console.error("Error toggling MySQL:", err);
                });
            this.busy = false;
        },
    },

    async mounted() {
        await this.status();
        this.$emit("ready");
    },
};
</script>

<template>
    <div class="uniserverz-container">
        <div class="uniserverz-info">
            <h2>Database</h2>
            <p>{{ name }}</p>
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
                <Checkbox @change.self="toggleApache" :checked="apacheStatus" :disabled="busy"
                    >Apache</Checkbox
                >

                <Checkbox @change.self="toggleMysql" :checked="mysqlStatus" :disabled="busy"
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

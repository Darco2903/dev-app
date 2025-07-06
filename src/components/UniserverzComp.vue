<script>
import * as uniserverz from "@mod/tauri/uniserverz";
import { wait } from "web-common";

export default {
    name: "UniserverzComp",

    data() {
        return {
            // ready: false,

            name: "",
            apacheStatus: false,
            mysqlStatus: false,
            busy: false,
            refreshBusy: false,
        };
    },

    computed: {
        isBothRunning() {
            return this.apacheStatus && this.mysqlStatus;
        },

        isBothStopped() {
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

        async toggleUni(enable) {
            this.busy = true;
            await uniserverz
                .toggleBoth(enable)
                .then(this.status)
                .catch((err) => {
                    console.error("Error toggling UniServerZ:", err);
                });
            this.busy = false;
        },

        async toggleApache(enable) {
            this.busy = true;
            await uniserverz
                .toggleApache(enable)
                .then(this.status)
                .catch((err) => {
                    console.error("Error toggling Apache:", err);
                });
            this.busy = false;
        },

        async toggleMysql(enable) {
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
        // this.ready = true;
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
        <button @click="status" :disabled="busy || refreshBusy">Refresh</button>
        <button @click="toggleUni(true)" :disabled="busy || isBothRunning">Start Database</button>
        <button @click="toggleUni(false)" :disabled="busy || isBothStopped">Stop Database</button>

        <div>
            <label for="toggle-apache">Enable Apache</label>
            <input
                type="checkbox"
                id="toggle-apache"
                v-model="apacheStatus"
                @change="toggleApache(apacheStatus)"
                :disabled="busy"
            />
        </div>

        <div>
            <label for="toggle-mysql">Enable MySQL</label>
            <input
                type="checkbox"
                id="toggle-mysql"
                v-model="mysqlStatus"
                @change="toggleMysql(mysqlStatus)"
                :disabled="busy"
            />
        </div>
    </div>
</template>

<style scoped>
input[type="checkbox"]:not(:disabled) {
    cursor: pointer;
}

.uniserverz-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>

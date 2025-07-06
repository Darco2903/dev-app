<script>
import { wait } from "web-common";

import SpinnerLoader from "@comp/SpinnerLoader.vue";
import CloudflaredComp from "@comp/CloudflaredComp.vue";
import UniserverzComp from "@comp/UniserverzComp.vue";

export default {
    name: "App",

    components: {
        SpinnerLoader,
        CloudflaredComp,
        UniserverzComp,
    },

    data() {
        return {
            preLoad: false,
            cloudflaredReady: false,
            uniserverzReady: false,
        };
    },

    computed: {
        ready() {
            return this.preLoad && this.cloudflaredReady && this.uniserverzReady;
        },
    },

    mounted() {
        wait(1500).then(() => {
            this.preLoad = true;
        });
    },
};
</script>

<template>
    <div class="app-container">
        <div class="l">
            <SpinnerLoader class="loading" size="100px" v-show="!ready" />
        </div>

        <div class="components" :ready>
            <CloudflaredComp ref="cloudflared" @ready="cloudflaredReady = true" />
            <UniserverzComp ref="uniserverz" @ready="uniserverzReady = true" />
        </div>
    </div>
</template>

<style>
.app-container {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #eee;
    margin-top: 60px;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.components:not([ready="true"]) {
    filter: blur(2px);
}
</style>

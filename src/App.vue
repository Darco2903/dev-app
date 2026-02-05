<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount } from "vue";
import { RouterView, useRouter } from "vue-router";
import { wait } from "@darco2903/web-common";
import { useMainStore } from "@store/main";
import { useConfigStore } from "@store/config";
import { useUIStore } from "@store/ui";
import { settings } from "@mod/settings";

import SpinnerLoader from "@comp/SpinnerLoader.vue";
import Confirm from "@comp/ui/Confirm.vue";
import NotifyContainer from "@comp/ui/NotifyContainer.vue";

const router = useRouter();
const mainStore = useMainStore();
const configStore = useConfigStore();
const ui = useUIStore();

const preLoad = ref<boolean>(false);

watch(
    () => router.currentRoute.value.path,
    async (newPath) => {
        await settings.set("lastPage", newPath);
    },
);

onBeforeMount(async () => {
    const lastPage = (await settings.get("lastPage")) as string | null;
    if (lastPage && lastPage !== router.currentRoute.value.path) {
        router.replace(lastPage);
    }
});

onMounted(async () => {
    const p1 = mainStore.preload();
    const p2 = configStore
        .init()
        .then(async () => {
            if (!configStore.isConfigured) {
                router.replace("/config");
            } else {
                await configStore.loadConfig();
                console.log("Config initialized.");
            }
        })
        .catch((e) => {
            console.error("Error during config initialization:", e);
            configStore.configError = true;
            router.replace("/config");
        });
    const p3 = wait(1500);
    await Promise.all([p1, p2, p3]);
    preLoad.value = true;
});
</script>

<template>
    <div class="app-container flex col center">
        <div>
            <SpinnerLoader class="loading" size="100px" v-show="!preLoad" />
        </div>

        <Confirm />
        <NotifyContainer />

        <RouterView class="components" :ready="preLoad" :inert="ui.isBodyInert()" />
    </div>
</template>

<style>
.app-container {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #eee;
    /* margin-top: 40px; */
    margin: 40px;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    text-align: center;
}

.components {
    width: 100%;
    filter: none;
    transition: filter 0.3s ease-in-out;
}

.components[ready="false"] {
    filter: blur(2px);
    pointer-events: none;
}
</style>

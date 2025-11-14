<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount } from "vue";
import { RouterView, useRouter } from "vue-router";
import { wait } from "web-common";
import { useStore } from "@store";
import { settings } from "@mod/settings";

import SpinnerLoader from "@comp/SpinnerLoader.vue";

const router = useRouter();
const store = useStore();

const preLoad = ref(false);

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
    const p1 = store.preload();
    const p2 = wait(1500);
    await Promise.all([p1, p2]);
    preLoad.value = true;
});
</script>

<template>
    <div class="app-container">
        <div>
            <SpinnerLoader class="loading" size="100px" v-show="!preLoad" />
        </div>

        <RouterView class="components" :ready="preLoad" />
    </div>
</template>

<style>
.app-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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

<script setup lang="ts">
import { Transition, KeepAlive } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import NavigationButton from "@comp/NavigationButton.vue";

import Home1 from "@icons/home-1.svg";
import Server1 from "@icons/server-1.svg";
import Settings1 from "@icons/settings-1.svg";

const router = useRouter();
const { t } = useI18n();
</script>

<template>
    <div class="layout">
        <div class="overview-content flex row">
            <div class="left flex col space-between">
                <div class="nav-bar">
                    <div class="nav-bar-content flex col">
                        <RouterLink class="no-underline no-outline" to="/">
                            <NavigationButton
                                :label="t('navBar.home')"
                                :active="router.currentRoute.value.path === '/'"
                            >
                                <Home1 class="text" />
                            </NavigationButton>
                        </RouterLink>

                        <RouterLink class="no-underline no-outline" to="/dns">
                            <NavigationButton
                                :label="t('navBar.DNS')"
                                :active="router.currentRoute.value.path === '/dns'"
                            >
                                <Server1 class="text" />
                            </NavigationButton>
                        </RouterLink>

                        <RouterLink class="no-underline no-outline" to="/settings">
                            <NavigationButton
                                :label="t('navBar.settings')"
                                :active="router.currentRoute.value.path === '/settings'"
                            >
                                <Settings1 class="text" />
                            </NavigationButton>
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div class="right">
                <RouterView v-slot="{ Component, route }">
                    <Transition name="fade-slide" mode="out-in">
                        <KeepAlive>
                            <component :is="Component" :key="route.name" />
                        </KeepAlive>
                    </Transition>
                </RouterView>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* .overview-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: calc(100% - 2 * 40px - 2 * 160px);
    width: calc(100% - 2 * 40px - 2 * 40px);
    max-width: 800px;
    min-width: 580px;
    padding: 20px 30px;
    border-radius: 25px;
    background-color: var(--bg);
    box-shadow: 0 4px 30px var(--box-shadow);
    transition: background-color 0.2s ease;
} */

.overview-content {
    /* height: calc(100% - 102px); */
     /* 82px (UpperPanel height) - 20px */
     gap: 20px;
}

.left {
    flex: 2;
    min-width: 200px;
}

.right {
    flex: 5;
    /* border-radius: 15px; */
    /* background-color: blue; */
}

.nav-bar-content {
    margin-top: 40px;
    gap: 12px;
    /* background-color: red; */
}
</style>

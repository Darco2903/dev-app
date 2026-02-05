<script setup lang="ts">
import { Transition, KeepAlive } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import NavigationButton from "@comp/NavigationButton.vue";

import Home1 from "@icons/home-1.svg";
import Server1 from "@icons/dns-1.svg";
import Settings1 from "@icons/settings-1.svg";
import Config1 from "@icons/config-1.svg";

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

                        <RouterLink class="no-underline no-outline" to="/config">
                            <NavigationButton
                                :label="t('navBar.config')"
                                :active="router.currentRoute.value.path === '/config'"
                            >
                                <Config1 class="text" />
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
.overview-content {
    gap: 20px;
}

.left {
    flex: 2;
    min-width: 200px;
}

.right {
    flex: 5;
}

.nav-bar-content {
    margin-top: 40px;
    gap: 12px;
}
</style>

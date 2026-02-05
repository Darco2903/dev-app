import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import Config from "@pages/Config.vue";
import Layout from "@pages/Layout.vue";
import CloudflaredUniserverz from "@pages/CloudflaredUniserverz.vue";
import DNS from "@pages/DNS.vue";
import Settings from "@pages/Settings.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Layout,
        meta: {
            title: "Layout",
        },
        children: [
            {
                path: "",
                component: CloudflaredUniserverz,
                meta: {
                    title: "Cloudflared + Uniserverz",
                },
            },
            {
                path: "dns",
                component: DNS,
                meta: {
                    title: "DNS",
                },
            },
            {
                path: "settings",
                component: Settings,
                meta: {
                    title: "Settings",
                },
            },
            {
                path: "config",
                component: Config,
                meta: {
                    title: "Config",
                },
            },
        ],
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

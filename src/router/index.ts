import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import * as Config from "@pages/Config.vue";
import * as Layout from "@pages/Layout.vue";
import * as CloudflaredUniserverz from "@pages/CloudflaredUniserverz.vue";
import * as DNS from "@pages/DNS.vue";
import * as Settings from "@pages/Settings.vue";

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

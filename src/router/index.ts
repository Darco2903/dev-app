import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const Config = () => import("@pages/Config.vue");
const Layout = () => import("@pages/Layout.vue");
const CloudflaredUniserverz = () => import("@pages/CloudflaredUniserverz.vue");
const DNS = () => import("@pages/DNS.vue");
const Settings = () => import("@pages/Settings.vue");

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

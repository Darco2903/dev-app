<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { wait } from "@darco2903/web-common";
import { useStore } from "@store";
import { settings } from "@mod/settings";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import * as cloudflare from "@mod/tauri/cloudflare";
import * as dns from "@mod/tauri/dns";
import type { Browser } from "@/types/bindings/Browser";
import type { BrowserName } from "@/types/browsers";
import { BROWSERS } from "@mod/consts";

import Copy1 from "@icons/copy-1.svg";

const store = useStore();
const { t } = useI18n();

const refreshBusy = ref<boolean>(false);
const inPrivate = ref<boolean>(true);
const browser = ref<BrowserName>("Edge");
const selectedBrowser = computed<Browser>(() => {
    switch (browser.value) {
        case "Edge":
            return { Edge: inPrivate.value };
        case "Opera":
            return { Opera: inPrivate.value };
    }
});

const emit = defineEmits<{
    ready: [];
}>();

async function refreshRecordList(): Promise<void> {
    refreshBusy.value = true;
    const p1 = cloudflare.dns_list_dev().then((records) => {
        store.dnsRecords = records;
    });

    const p2 = wait(1000);
    await Promise.all([p1, p2]);
    refreshBusy.value = false;
}

async function saveInPrivate(): Promise<void> {
    await settings.set("inPrivateMode", inPrivate.value);
}

async function saveBrowser(): Promise<void> {
    await settings.set("preferredBrowser", browser.value);
}

function onDnsNameClick(name: string): void {
    const url = `https://${name}`;
    dns.openUrlInBrowser(selectedBrowser.value, url);
}

onBeforeMount(async () => {
    settings.get<boolean>("inPrivateMode").then((res) => {
        if (res !== undefined) inPrivate.value = res;
    });
    settings.get<BrowserName>("preferredBrowser").then((res) => {
        if (res !== undefined) browser.value = res;
    });
});
</script>

<template>
    <div class="dns-container">
        <h2 class="dns-title text" style="font-weight: 800">{{ t("dns.title") }}</h2>

        <div class="content">
            <div class="container flex row align-center" style="gap: 20px">
                <button class="usr-btn" @click="refreshRecordList" :disabled="refreshBusy">
                    {{ t("common.refresh.refresh") }}
                </button>

                <select class="settings-select usr-select" v-model="browser" @change="saveBrowser">
                    <option v-for="brw in BROWSERS" :key="brw" :value="brw">
                        {{ brw }}
                    </option>
                </select>

                <div class="flex row" style="gap: 8px">
                    <input
                        type="checkbox"
                        class="usr-radio"
                        name="theme"
                        v-model="inPrivate"
                        @change="saveInPrivate"
                        style="appearance: none"
                    />
                    <div class="text">{{ t("dns.inPrivate") }}</div>
                </div>
            </div>

            <div class="container">
                <table class="dns-table usr-table">
                    <thead>
                        <tr>
                            <th>{{ t("dns.table.name") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in store.dnsRecords" :key="record.id">
                            <td class="dns-record flex row align-center space-between">
                                <div class="dns-record-name" @click="onDnsNameClick(record.name)">
                                    {{ record.name }}
                                </div>
                                <Copy1 class="copy-icon" @click="writeText(record.name)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    margin-top: 16px;
    max-height: 340px;
    overflow-y: auto;
}

.dns-table {
    td {
        padding: 8px 8px;
    }
}

.dns-record {
    &:hover {
        background-color: var(--hover);
    }
}

.dns-record-name {
    cursor: pointer;

    &:hover {
        color: var(--color-primary);
        text-decoration: underline;
    }

    &:active {
        filter: brightness(0.8);
    }
}

.copy-icon {
    width: 20px;
    height: 20px;
    padding: 6px;
    background-color: var(--bg-card);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
        color: var(--color-primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 10px var(--box-shadow);
    }

    &:active {
        transform: translateY(1px);
    }
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { wait } from "web-common";
import { useStore } from "@store";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import * as cloudflare from "@mod/tauri/cloudflare";

import Copy1 from "@icons/copy-1.svg";

const store = useStore();
const { t } = useI18n();

const refreshBusy = ref(false);

async function refreshRecordList() {
    refreshBusy.value = true;
    const p1 = cloudflare.dns_list_dev().then((records) => {
        store.dnsRecords = records;
    });

    const p2 = wait(1000);
    await Promise.all([p1, p2]);
    refreshBusy.value = false;
}

const emit = defineEmits<{
    ready: [];
}>();
</script>

<template>
    <div class="dns-container">
        <h2 class="dns-title text" style="font-weight: 800">{{ t("dns.title") }}</h2>

        <div class="content">
            <div class="container">
                <button class="usr-btn" @click="refreshRecordList" :disabled="refreshBusy">
                    {{ t("common.refresh.refresh") }}
                </button>
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
                                <div class="dns-record-name">{{ record.name }}</div>
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

.dns-record-name {
    user-select: text;
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

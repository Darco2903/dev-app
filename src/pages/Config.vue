<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { open } from "@tauri-apps/plugin-dialog";
import { useConfigStore } from "@store/config";
import { ref } from "vue";
import { wait } from "@darco2903/web-common";

const { t } = useI18n();
const configStore = useConfigStore();

const saving = ref<boolean>(false);

async function onSave() {
    saving.value = true;
    console.log("Saving config...");
    await Promise.all([
        //
        configStore.saveConfig(),
        wait(1500),
    ]);
    console.log("Config saved.");
    saving.value = false;
}

async function onBrowseUniPath() {
    const file = await open({
        multiple: false,
        directory: true,
    });

    console.log("Selected Uni path:", file);
    configStore.uniPath = file ?? "";
}
</script>

<template>
    <div class="servers-content max">
        <h2 class="servers-title text" style="font-weight: 800">{{ t("config.title") }}</h2>

        <div class="flex col max" style="gap: 20px">
            <div class="settings-container">
                <div class="settings-content flex column">
                    <div class="settings-sub setting-cloudflare flex col">
                        <div class="settings-sub-title text" style="font-weight: 600">
                            Cloudflare
                        </div>

                        <div class="settings-sub-content">
                            <div class="flex col" style="gap: 10px">
                                <div class="flex row align-center" style="gap: 8px">
                                    <span class="input-span">Api Token</span>
                                    <input
                                        type="password"
                                        class="usr-input"
                                        v-model="configStore.cloudflareApiToken"
                                    />
                                </div>

                                <div class="flex row align-center" style="gap: 8px">
                                    <span class="input-span">Zone ID</span>
                                    <input
                                        type="password"
                                        class="usr-input"
                                        v-model="configStore.cloudflareZoneId"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-content flex column">
                    <div class="settings-sub setting-uniserverz flex col">
                        <div class="settings-sub-title text" style="font-weight: 600">
                            Uniserverz
                        </div>

                        <div class="settings-sub-content">
                            <div class="flex col" style="gap: 10px">
                                <div class="flex row align-center" style="gap: 8px">
                                    <span class="input-span">Name</span>
                                    <input
                                        type="text"
                                        class="usr-input"
                                        v-model="configStore.uniName"
                                    />
                                </div>

                                <div class="flex row align-center" style="gap: 8px">
                                    <span class="input-span">Path</span>
                                    <input
                                        type="text"
                                        class="usr-input"
                                        v-model="configStore.uniPath"
                                    />
                                    <button
                                        class="usr-btn usr-btn-secondary"
                                        @click="onBrowseUniPath"
                                    >
                                        Browse
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex row" style="gap: 14px; padding-left: 20px">
                <button
                    class="usr-btn"
                    :disabled="saving || !configStore.isDirty"
                    @click="configStore.resetToOlds"
                >
                    {{ t("config.cancelButton") }}
                </button>

                <button class="usr-btn" :disabled="saving || !configStore.isDirty" @click="onSave">
                    {{ t("config.saveButton") }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-content {
    gap: 30px;
    margin-top: 20px;
    padding: 10px 20px;
}

.settings-sub {
    gap: 10px;
}

.input-span {
    width: 80px;
}
</style>

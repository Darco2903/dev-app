<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { loadLocale, Locale } from "@loc/index";
import { saveTheme, setTheme, theme, Theme } from "@mod/themes";
import { store } from "@store/store";

const state = store.state;
const { t } = useI18n();

function changeLang(e: Event) {
    const target = e.target as HTMLSelectElement;
    const selectedLang = target.value as Locale;
    loadLocale(selectedLang);
}

async function changeTheme(e: Event) {
    const target = e.target as HTMLSelectElement;
    const selectedTheme = target.value as Theme;
    setTheme(selectedTheme);
    await saveTheme(selectedTheme);
}
</script>

<template>
    <div class="servers-content">
        <h2 class="servers-title text" style="font-weight: 800">{{ t("settings.title") }}</h2>

        <div class="settings-content flex column">
            <div class="settings-sub setting-language flex col">
                <div class="settings-sub-title text" style="font-weight: 600">
                    {{ t("settings.language") }}
                </div>

                <div class="settings-sub-content">
                    <select
                        class="settings-select usr-select"
                        v-model="state.language"
                        @change="changeLang"
                    >
                        <option v-for="value in Locale" :key="value" :value="value">
                            {{ t(`common.locale.${value.toLowerCase()}`) }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="settings-sub setting-theme flex col">
                <div class="settings-sub-title text" style="font-weight: 600">
                    {{ t("settings.theme") }}
                </div>

                <div class="settings-sub-content">
                    <div class="theme-selection flex row">
                        <div v-for="value in Theme" :key="value" class="flex row" style="gap: 8px">
                            <input
                                type="radio"
                                class="usr-radio"
                                :value="value"
                                name="theme"
                                @change="changeTheme"
                                :checked="theme === value"
                            />
                            <div class="text">{{ t(`common.theme.${value.toLowerCase()}`) }}</div>
                        </div>
                    </div>
                </div>
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

.theme-selection {
    gap: 20px;
}
</style>

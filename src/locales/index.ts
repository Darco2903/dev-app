import { watchEffect } from "vue";
import { createI18n } from "vue-i18n";
import { Locale } from "./types";
export { Locale } from "./types";
import { settings } from "@mod/settings";

import en from "./en/index";
import fr from "./fr/index";

const savedLang = (await settings.get("lang")) as string | null;
const navigatorLang = navigator.language.split("-")[0];
let defaultLang: string = Locale.EN;

if (savedLang && Object.values(Locale).includes(savedLang as Locale)) {
    defaultLang = savedLang;
} else if (navigatorLang) {
    defaultLang = navigatorLang;
}

export const i18n = createI18n({
    legacy: false,
    locale: defaultLang,
    fallbackLocale: "en",
    messages: {
        en,
        fr,
    },
});

export function loadLocale(lang: Locale) {
    i18n.global.locale.value = lang;
}

export function getLocale(): Locale {
    return i18n.global.locale.value as Locale;
}

watchEffect(async () => {
    await settings.set("lang", i18n.global.locale.value);
});

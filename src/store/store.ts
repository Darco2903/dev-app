import { type InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { Locale } from "@loc/index";
import { Theme } from "@mod/themes";
import type { DnsRecordType } from "@/types/DnsRecordType";
import type { UniServerzInfo } from "@/modules/tauri/uniserverz";

export interface State {
    theme: Theme;
    language: Locale;
    tunnelStatus: string;
    dbInfo: UniServerzInfo;
    dnsRecords: DnsRecordType[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        theme: Theme.SYSTEM,
        language: Locale.EN,
        tunnelStatus: "Initializing",
        dbInfo: {
            name: "",
            apache: false,
            mysql: false,
        },
        dnsRecords: [],
    },
});

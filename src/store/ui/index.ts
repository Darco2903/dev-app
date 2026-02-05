import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useConfirmStore } from "./confirm";
import { useNotifyStore } from "./notify";

export type * from "./confirm";
export type * from "./notify";

const useUIStore = defineStore("ui", () => {
    const confirmStore = useConfirmStore();

    const dialogActive = computed(() => confirmStore.isActive);
    const overlayActive = ref(false);

    function isBodyInert(): boolean {
        return dialogActive.value || overlayActive.value;
    }

    return {
        // state
        dialogActive,
        overlayActive,

        // actions
        isBodyInert,
    };
});

export {
    //
    useConfirmStore,
    useNotifyStore,
    useUIStore,
};

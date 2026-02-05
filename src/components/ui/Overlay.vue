<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useUIStore as useUiStore } from "@store/ui";

const ui = useUiStore();

const emit = defineEmits<{
    close: [];
}>();

function onKeyDown(event: KeyboardEvent) {
    if (ui.dialogActive) return;

    if (event.key === "Escape") {
        emit("close");
    }
}

onMounted(() => {
    ui.overlayActive = true;
    window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
    ui.overlayActive = false;
    window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
    <Teleport to="body">
        <!-- <div class="overlay-backdrop" /> -->

        <div class="overlay-content" :inert="ui.dialogActive">
            <slot />
        </div>
    </Teleport>
</template>

<style scoped>
/* .overlay-backdrop {
    position: fixed;
    inset: 0;
    background: transparent;
    pointer-events: all;
    z-index: 1000;
} */

.overlay-content {
    position: fixed;
    inset: 0;
    z-index: 1001;
    pointer-events: none;

    & > * {
        pointer-events: auto;
    }
}
</style>

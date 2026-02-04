<script setup lang="ts">
import { useConfigStore } from "@store/config";

import CloudflaredComp from "@comp/CloudflaredComp.vue";
import UniserverzComp from "@comp/UniserverzComp.vue";

const configStore = useConfigStore();
</script>

<template>
    <div class="components max flex column align-center" :disabled="!configStore.isOk">
        <CloudflaredComp ref="cloudflared" />
        <UniserverzComp ref="uniserverz" />
    </div>
</template>

<style scoped>
.components {
    & > *:not(:last-child) {
        /* margin-bottom: 20px; */
        padding-bottom: 20px;
        border-bottom: 1px solid #aaa8;
    }

    &[disabled="true"] {
        pointer-events: none;
        filter: opacity(0.6);
    }
}
</style>

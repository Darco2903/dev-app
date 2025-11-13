<script setup lang="ts">
import CloudflaredComp from "@comp/CloudflaredComp.vue";
import UniserverzComp from "@comp/UniserverzComp.vue";
</script>

<template>
    <div class="components">
        <CloudflaredComp ref="cloudflared" />
        <UniserverzComp ref="uniserverz" />
    </div>
</template>

<style scoped>
.components {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.components > *:not(:last-child) {
    /* margin-bottom: 20px; */
    padding-bottom: 20px;
    border-bottom: 1px solid #aaa8;
}
</style>

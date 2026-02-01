<script setup lang="ts">
import CloudflaredComp from "@comp/CloudflaredComp.vue";
import UniserverzComp from "@comp/UniserverzComp.vue";
</script>

<template>
    <div class="components max flex column align-center">
        <CloudflaredComp ref="cloudflared" />
        <UniserverzComp ref="uniserverz" />
    </div>
</template>

<style scoped>
.components > *:not(:last-child) {
    /* margin-bottom: 20px; */
    padding-bottom: 20px;
    border-bottom: 1px solid #aaa8;
}
</style>

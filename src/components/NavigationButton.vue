<script setup lang="ts">
const { label } = defineProps({
    label: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="navbut-container flex row">
        <div class="navbut-icon">
            <slot class="navbut-icon-content" />
        </div>
        <div class="navbut-label flex center">
            <div class="text">{{ label }}</div>
        </div>
    </div>
</template>

<style scoped>
.navbut-container {
    gap: 16px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 12px;
    width: fit-content;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 10px var(--box-shadow);
    }

    &:active {
        transform: translateY(0px);
        box-shadow: none;
    }

    &[active="true"] {
        background-color: var(--border);
    }
}

.navbut-icon {
    width: 32px;
    height: 32px;
}

.navbut-label {
    font-size: 22px;
    font-weight: bold;
    user-select: none;
}
</style>

<script setup lang="ts">
import { ref, watch } from "vue";

const {
    checked = false,
    size = "30px",
    haloSize = "14px",
    spread = "8px",
    disabled = false,
} = defineProps<{
    checked?: boolean;
    size?: string;
    haloSize?: string;
    spread?: string;
    disabled?: boolean;
}>();

const vChecked = ref<boolean>(checked);
const id = ref<string>(`checkbox-${Math.random().toString(36).substr(2, 9)}`);

const emit = defineEmits<{
    change: [boolean];
}>();

watch(
    () => checked,
    (newVal) => {
        vChecked.value = newVal;
    },
);

function onChange(): void {
    emit("change", !checked);
}
</script>

<template>
    <div class="checkbox-container">
        <div class="checkbox-slot">
            <slot></slot>
        </div>

        <div class="sub-container">
            <label :for="id">
                <input type="checkbox" :id v-model="vChecked" @change="onChange" :disabled />
                <div class="checkmark"></div>
            </label>
        </div>
    </div>
</template>

<style scoped>
/* From Uiverse.io by gagan-gv */
/* Edited by Darco2903 */

.checkbox-container {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.checkbox-slot {
    z-index: 1;
}

.sub-container:has(input:disabled) {
    pointer-events: none;
    filter: grayscale(50%) brightness(0.8) contrast(0.9);
}

/* Hide the default checkbox */
.sub-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.sub-container {
    display: block;
    position: relative;
    font-size: 25px;
    user-select: none;
}

/* Create a custom checkbox */
.checkmark {
    position: relative;
    top: 0;
    left: 0;
    height: v-bind(size);
    width: v-bind(size);
    background: black;
    border-radius: 50px;
    transition: all 0.7s;
    cursor: pointer;
}

.sub-container input ~ .checkmark::before {
    display: block;
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: -1;
    background: linear-gradient(135deg, #00a6ff 30%, #c5007f 65%);
    width: calc(v-bind(size) + v-bind (haloSize));
    height: calc(v-bind(size) + v-bind(haloSize));
    filter: blur(200px);
    transition: all ease 0.8s;
}

.sub-container input:checked ~ .checkmark::before {
    filter: blur(v-bind(spread));
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.sub-container input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.sub-container .checkmark:after {
    top: 50%;
    left: 50%;
    width: 20%;
    height: 44%;
    border: solid #f0f0f0;
    border-width: 0 0.15em 0.15em 0;
    transform: translate(-50%, -50%) rotate(45deg);
}
</style>

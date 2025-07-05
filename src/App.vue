<script>
import CloudflaredComp from "@comp/CloudflaredComp.vue";

export default {
    components: {
        CloudflaredComp,
    },

    data() {
        return {
            //
        };
    },
};
</script>

<template>
    <div class="app-container">
        <CloudflaredComp />
    </div>
</template>

<style>
.app-container {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #eee;
    margin-top: 60px;
}
</style>

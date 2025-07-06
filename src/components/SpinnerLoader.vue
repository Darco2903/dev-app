<script>
export default {
    name: "SpinnerLoader",

    props: {
        size: {
            type: String,
            default: "150px",
        },
    },
};
</script>

<template>
    <div class="loader-container">
        <span class="loader"></span>
    </div>
</template>

<style scoped>
.loader-container {
    display: flex;
    opacity: 0.85;
}

.loader {
    width: v-bind(size);
    height: v-bind(size);
    background: linear-gradient(180deg, #00a6ffee 20%, #c5007fee 80%);
    border-radius: 50%;
    position: relative;
    box-shadow:
        0 0 30px 4px rgba(0, 0, 0, 0.5) inset,
        0 5px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;

    transform: rotate(-50deg);
}

.loader:before,
.loader:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 45%;
    top: -40%;
    background-color: #fff;
    animation: wave 5s linear infinite;
}

.loader:before {
    border-radius: 30%;
    background: rgba(255, 255, 255, 0.4);
    animation: wave 5s linear infinite;
}

@keyframes wave {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>

<template>
  <div class="spinner-wrapper">
    <img src="@/assets/icon-spinner.svg" alt="Loading..." class="spinner" />
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.spinner-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  min-height: 100%;
}

.spinner {
  width: 70px;
  height: 70px;
  animation: spin 1s linear infinite;
  pointer-events: none;
}

.spinner-text {
  margin-top: 15px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

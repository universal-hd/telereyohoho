<template>
  <transition name="fade">
    <div v-if="visible" class="notification">
      <span v-html="message" @click="handleClick"></span>
      <button class="close-btn" @click="hideNotification">✕</button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const onClick = ref(null)

const showNotification = (msg, duration = 3000, options = {}) => {
  message.value = msg
  onClick.value = options.onClick || null
  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, duration)
}

const hideNotification = () => {
  visible.value = false
}

const handleClick = (event) => {
  if (event.target.tagName === 'A' && onClick.value) {
    event.preventDefault()
    onClick.value()
  }
}

// Экспортируем функцию для вызова уведомления
defineExpose({ showNotification })
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #444;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 8;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(a) {
  color: var(--accent-color);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

:deep(a:hover) {
  color: var(--accent-hover);
}

.success-icon {
  color: var(--accent-color);
}
</style>

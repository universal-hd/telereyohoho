<template>
  <div>
    <!-- Если передано сообщение об ошибке, отображаем его -->
    <div v-if="message" class="error-message">
      <p>{{ message }}</p>
      <div class="buttons-container">
        <!-- Если код ошибки >= 500, показываем кнопку "Статус" -->
        <a v-if="code >= 500" :href="statusUrl" class="button">Статус</a>
        <router-link to="/" class="button">На главную</router-link>
      </div>
    </div>
    <!-- Если сообщения нет, просто отображаем кнопку "Статус" -->
    <div v-else class="status-container">
      <a :href="statusUrl" class="button">Статус</a>
    </div>
  </div>
</template>

<script setup>
const statusUrl = 'http://45.136.199.126:3001/status/reyohoho'

const { message, code } = defineProps({
  message: {
    type: String,
    default: ''
  },
  code: {
    type: Number,
    default: null
  }
})
</script>

<style scoped>
.status-container {
  text-align: center;
  margin-top: 20px;
}

/* Общий стиль для кнопок */
.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: var(--accent-hover);
}

.error-message {
  color: var(--accent-color);
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  margin: 20px auto;
  max-width: 500px;
  background: var(--accent-transparent);
}

/* Контейнер кнопок */
.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}
</style>

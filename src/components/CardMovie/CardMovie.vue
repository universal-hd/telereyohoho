<template>
  <RouterLink
    ref="element"
    class="movie-card"
    :class="{
      active: activeMovieIndex === index,
      'has-border': isCardBorder,
      'hover-disabled': isCardHoverDisabled,
      'card-border': isCardBorder,
      [`card-size-${cardSize}`]: true
    }"
    :to="{ name: 'movie-info', params: { kp_id: movie.kp_id } }"
    :data-test-id="`movie-card-${movie.kp_id}`"
    tabindex="0"
  >
    <CardsMovieMainContent
      :movie
      :is-history
      :is-mobile
      :is-user-list="isUserList"
      :show-delete="showDelete"
      :show-star="showStar"
      @remove:from-history="(data) => emit('remove:from-history', data)"
    />

    <CardMovieDetails :movie :is-history />
  </RouterLink>
</template>

<script setup>
import { onMounted, useTemplateRef, computed } from 'vue'
import CardMovieDetails from './CardMovieDetails.vue'
import CardsMovieMainContent from './CardsMovieMainContent.vue'
import { useBackgroundStore } from '@/store/background'
import { useMainStore } from '@/store/main'

const backgroundStore = useBackgroundStore()
const mainStore = useMainStore()
const isCardHoverDisabled = computed(() => backgroundStore.isCardHoverDisabled)
const cardSize = computed(() => mainStore.cardSize)

const {
  movie,
  isHistory = false,
  isCardBorder = false,
  isMobile = false,
  isUserList = false,
  activeMovieIndex = null,
  index = 0,
  showDelete = true,
  showStar = false
} = defineProps({
  movie: Object,
  isHistory: Boolean,
  isMobile: Boolean,
  isCardBorder: Boolean,
  isUserList: Boolean,
  index: Number,
  activeMovieIndex: [Number, null],
  showDelete: Boolean,
  showStar: Boolean
})

const emit = defineEmits(['remove:from-history', 'save:element'])
const element = useTemplateRef('element')

onMounted(() => {
  if (element.value && element.value.$el) {
    emit('save:element', element.value.$el)
  }
})
</script>

<style scoped>
.movie-card {
  text-decoration: none;
  color: inherit;
  width: 100%;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  border: none;
}

.has-border {
  border: 1px solid var(--accent-color);
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.3),
    0 0 20px var(--accent-semi-transparent);
}

.hover-disabled:hover {
  transform: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.movie-card:focus {
  outline: 2px solid white;
  outline-offset: 2px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
  transition: border 0.2s ease;
  cursor: pointer;
}

.movie-card:hover :deep(.delete-button) {
  opacity: 1;
}

.movie-card.card-size-small :deep(.movie-details) {
  padding: 10px;
}

.movie-card.card-size-small :deep(.movie-header h3) {
  font-size: 0.95em;
  -webkit-line-clamp: 3;
  -moz-line-clamp: 3;
  line-clamp: 3;
  max-height: 3.6em;
}

.movie-card.card-size-small :deep(.original-title) {
  font-size: 0.75em;
  -webkit-line-clamp: 1;
  -moz-line-clamp: 1;
  line-clamp: 1;
}

.movie-card.card-size-small :deep(.genre-tag),
.movie-card.card-size-small :deep(.genre-count) {
  font-size: 0.7em;
  padding: 1px 4px;
}

.movie-card.card-size-large :deep(.movie-details) {
  padding: 20px;
}

.movie-card.card-size-large :deep(.movie-header h3) {
  font-size: 1.3em;
  -webkit-line-clamp: 4;
  -moz-line-clamp: 4;
  line-clamp: 4;
  max-height: 5.2em;
}

.movie-card.card-size-large :deep(.original-title) {
  font-size: 0.9em;
  margin-bottom: 15px;
}

.movie-card.card-size-large :deep(.genre-tag),
.movie-card.card-size-large :deep(.genre-count) {
  font-size: 0.8em;
  padding: 3px 8px;
}

.movie-card.card-size-large :deep(.year) {
  font-size: 1em;
}

/* Мобильная версия */
@media (max-width: 620px) {
  .movie-card {
    flex-direction: row;
    align-items: flex-start;
    height: 200px;
    width: 100%;
    border-radius: 15px;
  }
}
</style>

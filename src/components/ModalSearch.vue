<template>
  <div class="search" @click="closeModal">
    <div class="search__content" @click.stop>
      <!-- Поиск -->
      <div class="input-wrapper">
        <input
          ref="searchInput"
          v-model="searchTerm"
          placeholder="Введите название фильма"
          class="search-input"
          :class="{ 'wrong-layout': showLayoutWarning }"
          @keydown.enter="search"
          @keydown.tab.prevent="handleTabKey"
          @keydown.down.prevent="focusFirstMovieCard"
          @input="handleInput"
        />
        <div v-if="showLayoutWarning" class="layout-warning" :class="{ show: showLayoutWarning }">
          <i class="fas fa-keyboard"></i>
          Возможно, вы используете неправильную раскладку. Нажмите Tab для переключения на
          {{ suggestedLayout }} раскладку
        </div>
      </div>

      <!-- Результаты поиска -->
      <div v-if="!errorMessage" class="search__results-wrapper">
        <div class="search__results">
          <div v-if="searchTerm?.length < 3" class="no-results">
            Здесь появятся результаты поиска
          </div>

          <template v-else-if="loading">
            <div v-for="idx in [0, 1, 2, 3]" :key="idx" class="movie-skeleton">
              <div class="movie-skeleton__poster"></div>
              <div class="movie-skeleton__content">
                <div class="movie-skeleton__title"></div>
                <div class="movie-skeleton__meta">
                  <div class="movie-skeleton__rating"></div>
                </div>
              </div>
            </div>
          </template>

          <div v-else-if="movies.length === 0 && !loading" class="no-results">
            Для просмотра ничего не найдено
          </div>

          <div v-else>
            <router-link
              v-for="movie in movies"
              :key="movie.id"
              class="search__movie movie"
              :to="{ name: 'movie-info', params: { kp_id: movie.kp_id } }"
              @click="closeModal"
            >
              <img :src="movie.poster" alt="poster" class="movie__poster" />
              <div class="movie__info">
                <div class="movie__title">
                  {{ movie.raw_data?.name_ru ?? movie.raw_data?.name_en }}
                </div>
                <div class="movie__meta">
                  <span class="movie__rating" :class="getRatingColor(movie.raw_data?.rating)">
                    {{ movie.raw_data?.rating !== 'null' ? (movie.raw_data?.rating ?? '-') : '-' }}
                  </span>
                  <span class="movie__type"> {{ TYPES_ENUM[movie.raw_data?.type] ?? '-' }}, </span>
                  <span class="movie__year">
                    {{ movie.year }}
                  </span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <ErrorMessage v-if="errorMessage" :message="errorMessage" :code="errorCode" />

      <button class="btn btn--close" @click="closeModal">
        <i class="fas fa-close"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { apiSearch } from '@/api/movies'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { TYPES_ENUM } from '@/constants'
import { handleApiError } from '@/constants'
import { useNavbarStore } from '@/store/navbar'
import { hasConsecutiveConsonants, suggestLayout, convertLayout } from '@/utils/keyboardLayout'
import debounce from 'lodash/debounce'
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { useMainStore } from '@/store/main'
import { getRatingColor } from '@/utils/ratingUtils'

const navbarStore = useNavbarStore()

const searchTerm = ref('')
const movies = ref([])
const loading = ref(false)

// Глобальные переменные для ошибок
const errorMessage = ref('')
const errorCode = ref(null)

const searchInput = ref(null)
const activeMovieIndex = ref(null)

const showLayoutWarning = ref(false)
const suggestedLayout = ref('')
const store = useMainStore()
const isMobile = computed(() => store.isMobile)

onMounted(async () => {
  await nextTick()
  document.addEventListener('keydown', handleKeyDown)
  searchInput.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Очистка поиска
const resetSearch = () => {
  searchTerm.value = ''
  movies.value = []
  errorMessage.value = ''
  errorCode.value = null
  showLayoutWarning.value = false
}

const search = () => {
  debouncedPerformSearch.cancel()
  if (searchTerm.value) {
    performSearch()
  } else {
    alert('Введите запрос для поиска')
  }
}

const performSearch = async () => {
  loading.value = true
  movies.value = []

  // Сброс предыдущих ошибок
  errorMessage.value = ''
  errorCode.value = null

  try {
    // Поиск по названию
    const results = await apiSearch(searchTerm.value)
    movies.value = (results || []).map((movie) => ({ ...movie, kp_id: movie.id.toString() }))
  } catch (error) {
    // Используем универсальный обработчик ошибок
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
    console.error('Ошибка при выполнении поиска:', error)
    movies.value = []
  } finally {
    loading.value = false
  }
}

const debouncedPerformSearch = debounce(() => {
  if (searchTerm.value.length >= 2) {
    performSearch()
  } else if (searchTerm.value.length < 2) {
    movies.value = []
  }
}, 700)

const closeModal = (event) => {
  const isLeftClick = event.button === 0

  // Проверяем, что не зажаты Ctrl или Cmd
  const isNotModified = !event.ctrlKey && !event.metaKey

  // Если это обычный клик, скрываем попап
  if ((isLeftClick && isNotModified) || !event) {
    navbarStore.closeSearchModal() // Используем метод из хранилища для закрытия модалки
    resetSearch()
  }
}

const handleInput = (event) => {
  searchTerm.value = event.target.value
  if (isMobile.value) return
  showLayoutWarning.value = hasConsecutiveConsonants(searchTerm.value)
  if (showLayoutWarning.value) {
    suggestedLayout.value = suggestLayout(searchTerm.value)
  }
}

const handleTabKey = () => {
  if (showLayoutWarning.value) {
    searchTerm.value = convertLayout(searchTerm.value)
    showLayoutWarning.value = false
  }
}

const focusFirstMovieCard = () => {
  if (movies.value.length > 0) {
    const firstMovieCard = document.querySelector('.search__movie')
    if (firstMovieCard) {
      firstMovieCard.focus()
      activeMovieIndex.value = 0
    }
  }
}

const handleKeyDown = (event) => {
  if (!movies.value?.length) return

  if (!event.target?.classList?.contains('search__movie')) {
    return
  }

  switch (event.key) {
    case 'ArrowRight':
      activeMovieIndex.value = (activeMovieIndex.value + 1) % movies.value.length
      break
    case 'ArrowLeft':
      activeMovieIndex.value =
        (activeMovieIndex.value - 1 + movies.value.length) % movies.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      if (activeMovieIndex.value <= 0) {
        const searchInput = document.querySelector('.search-input')
        if (searchInput) {
          searchInput.focus()
        }
      } else {
        activeMovieIndex.value = Math.max(activeMovieIndex.value - 1, 0)
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      activeMovieIndex.value = Math.min(activeMovieIndex.value + 1, movies.value.length - 1)
      break
    case 'Home':
      activeMovieIndex.value = 0
      break
    case 'End':
      activeMovieIndex.value = movies.value.length - 1
      break
  }
}

watch(activeMovieIndex, (newIndex) => {
  if (newIndex !== null) {
    const movieCards = document.querySelectorAll('.search__movie')
    if (movieCards[newIndex]) {
      movieCards[newIndex].focus()
    }
  }
})

// Автопоиск с задержкой
watch(searchTerm, () => {
  debouncedPerformSearch()
})
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    background: rgba(30, 30, 30, 0.96);
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    width: 100%;
    max-height: 90vh;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    @media screen and (max-width: 600px) {
      max-width: 400px;
    }

    @media (min-width: 768px) {
      max-width: 600px;
    }

    @media (min-width: 1200px) {
      max-width: 800px;
    }
  }

  &__results-wrapper {
    flex: 1;
    overflow-y: auto; // Прокрутка только для результатов
    margin-top: 20px;
    max-height: calc(90vh - 120px); // Ограничение высоты (учитывая высоту инпута и отступы)
  }

  &__results {
    color: #fff;
    width: 100%;
    box-sizing: border-box;

    /* Сообщение "Ничего не найдено" */
    .no-results {
      width: 100%;
      text-align: center;
      font-size: 18px;
      margin: 20px auto;
    }
  }

  .movie {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 16px;
    gap: 12px;
    cursor: pointer;
    text-decoration: none;
    color: #fff;
    border-radius: 10px;
    outline: none;
    margin: 2px;

    &:hover {
      background: rgba(34, 34, 34, 0.98);
    }

    &:focus {
      background: rgba(34, 34, 34, 0.98);
      box-shadow: 0 0 0 2px var(--accent-color);
    }

    &__poster {
      width: 32px;
    }

    &__title {
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      padding: 0;
      margin: 0;
    }

    &__meta {
      display: flex;
      gap: 7px;
      margin-top: 3px;
    }

    &__rating {
      &.low {
        color: #ff6b6b;
      }

      &.medium {
        color: #ffd93d;
      }

      &.high {
        color: #51cf66;
      }
    }
  }
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-top: 20px;
}

.search-input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px var(--accent-transparent);
  }

  &.wrong-layout {
    border-color: #ff8c00;
    box-shadow: 0 0 5px rgba(255, 140, 0, 0.2);
  }
}

.layout-warning {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  text-align: center;
  color: #ff8c00;
  font-size: 14px;
  background: rgba(255, 140, 0, 0.15);
  padding: 8px 12px;
  border-radius: 5px;
  pointer-events: none;
  border: 1px solid rgba(255, 140, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1;
  backdrop-filter: blur(5px);
}

.layout-warning.show {
  opacity: 1;
  transform: translateY(0);
}

.layout-warning i {
  font-size: 16px;
  color: #ff8c00;
}

.movie-skeleton {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 16px;
  gap: 12px;
  border-radius: 10px;
  background: rgba(34, 34, 34, 0.5); // Цвет фона, похожий на реальный элемент

  &__poster {
    width: 32px;
    height: 48px; // Высота постерa
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    animation: shimmer 1.5s infinite linear;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    width: 70%;
    height: 18px; // Высота заголовка
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    animation: shimmer 1.5s infinite linear;
  }

  &__meta {
    display: flex;
    gap: 7px;
  }

  &__rating {
    width: 40px;
    height: 14px; // Высота рейтинга
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    animation: shimmer 1.5s infinite linear;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.movie-skeleton__poster,
.movie-skeleton__title,
.movie-skeleton__rating {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.filter-select:focus {
  border-color: var(--accent-color);
}

.status.completed {
  color: var(--accent-color);
}
</style>

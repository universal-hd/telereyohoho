import { defineStore } from 'pinia'

export const useNavbarStore = defineStore('navbar', {
  state: () => ({
    isNavbarVisible: false,
    isModalSearchVisible: false,
    headerContent: null
  }),
  actions: {
    // Методы для навбара
    toggleNavbar() {
      this.isNavbarVisible = !this.isNavbarVisible
    },
    closeNavbar() {
      this.isNavbarVisible = false
    },
    openNavbar() {
      this.isNavbarVisible = true
    },
    // Методы для модалки поиска
    toggleSearchModal() {
      this.isModalSearchVisible = !this.isModalSearchVisible
    },
    openSearchModal() {
      this.isModalSearchVisible = true
      this.isNavbarVisible = false
    },
    closeSearchModal() {
      this.isModalSearchVisible = false
    },
    // Метод для обновления содержимого хедера
    setHeaderContent(content) {
      this.headerContent = content
    },
    // Метод для очистки содержимого хедера
    clearHeaderContent() {
      this.headerContent = null
    }
  }
})

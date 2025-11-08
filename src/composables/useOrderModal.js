import { ref } from 'vue'

const isOrderModalOpen = ref(false)

export function useOrderModal() {
  const openOrderModal = () => {
    isOrderModalOpen.value = true
  }

  const closeOrderModal = () => {
    isOrderModalOpen.value = false
  }

  return {
    isOrderModalOpen,
    openOrderModal,
    closeOrderModal,
  }
}

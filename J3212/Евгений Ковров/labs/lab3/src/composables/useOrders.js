import { ref } from 'vue';

export function useOrders() {
  const orders = ref([]);
  const isLoading = ref(false);

  return {
    orders,
    isLoading
  };
}

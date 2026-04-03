import { ref } from 'vue';

export function useEvents() {
  const events = ref([]);
  const selectedEvent = ref(null);
  const isLoading = ref(false);

  return {
    events,
    selectedEvent,
    isLoading
  };
}

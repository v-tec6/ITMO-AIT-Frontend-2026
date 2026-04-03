import { ref } from 'vue';
import { fetchEventById, fetchEvents } from '../api/events';

export function useEvents() {
  const events = ref([]);
  const currentEvent = ref(null);
  const isLoading = ref(false);
  const error = ref('');

  async function loadEvents() {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedEvents = await fetchEvents();
      events.value = Array.isArray(loadedEvents)
        ? loadedEvents.filter((event) => (event.status || 'Опубликовано') === 'Опубликовано')
        : [];
      return events.value;
    } catch (requestError) {
      console.error('Events loading failed.', requestError);
      error.value = 'Не удалось загрузить мероприятия. Попробуйте позже.';
      throw requestError;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadEventById(id) {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedEvent = await fetchEventById(id);
      currentEvent.value = loadedEvent;
      return loadedEvent;
    } catch (requestError) {
      console.error(`Event loading failed for id ${id}.`, requestError);
      error.value = requestError.response?.status === 404
        ? 'Мероприятие не найдено.'
        : 'Не удалось загрузить данные мероприятия. Попробуйте позже.';
      throw requestError;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    events,
    currentEvent,
    isLoading,
    error,
    loadEvents,
    loadEventById
  };
}

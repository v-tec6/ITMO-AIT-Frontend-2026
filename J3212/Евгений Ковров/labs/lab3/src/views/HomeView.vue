<template>
  <section class="view-section">
    <p class="eyebrow">Главная</p>
    <h1>Каталог мероприятий</h1>

    <div class="catalog-filters">
      <label class="auth-form__field catalog-filters__field">
        <span>Поиск</span>
        <input v-model.trim="filters.search" type="search" placeholder="Название, площадка, город" />
      </label>

      <label class="auth-form__field catalog-filters__field">
        <span>Категория</span>
        <select v-model="filters.category" class="catalog-filters__select">
          <option value="Все">Все</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>

      <label class="auth-form__field catalog-filters__field">
        <span>Город</span>
        <select v-model="filters.city" class="catalog-filters__select">
          <option value="Все">Все</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </label>

      <label class="auth-form__checkbox catalog-filters__checkbox">
        <input v-model="filters.onlyAvailable" type="checkbox" />
        <span>Только доступные</span>
      </label>

      <button class="button-link button-link--ghost catalog-filters__reset" type="button" @click="resetFilters">
        Сбросить
      </button>
    </div>

    <div v-if="isLoading" class="state-box">Загрузка мероприятий...</div>
    <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
    <div v-else-if="!events.length" class="state-box">Пока нет доступных мероприятий.</div>
    <div v-else-if="!filteredEvents.length" class="state-box">
      По выбранным фильтрам ничего не найдено. Попробуйте изменить параметры поиска.
    </div>
    <div v-else class="events-grid">
      <EventCard v-for="event in filteredEvents" :key="event.id" :event="event" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import EventCard from '../components/EventCard.vue';
import { useEvents } from '../composables/useEvents';

const { events, isLoading, error, loadEvents } = useEvents();
const defaultFilters = {
  search: '',
  category: 'Все',
  city: 'Все',
  onlyAvailable: true
};
const filters = reactive({
  ...defaultFilters
});

const categories = computed(() => [...new Set(events.value.map((event) => event.category).filter(Boolean))]);
const cities = computed(() => [...new Set(events.value.map((event) => event.city).filter(Boolean))]);

const filteredEvents = computed(() => {
  const searchValue = filters.search.trim().toLowerCase();

  return events.value.filter((event) => {
    if (filters.onlyAvailable && Number(event.availableTickets || 0) <= 0) {
      return false;
    }

    if (filters.category !== 'Все' && event.category !== filters.category) {
      return false;
    }

    if (filters.city !== 'Все' && event.city !== filters.city) {
      return false;
    }

    if (!searchValue) {
      return true;
    }

    return [event.title, event.description, event.city, event.venue, event.category]
      .join(' ')
      .toLowerCase()
      .includes(searchValue);
  });
});

function resetFilters() {
  Object.assign(filters, defaultFilters);
}

onMounted(async () => {
  try {
    await loadEvents();
  } catch (requestError) {
    // Error state is handled inside the composable.
  }
});
</script>

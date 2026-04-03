<template>
  <section class="view-section">
    <p class="eyebrow">Мероприятие</p>
    <div v-if="isLoading" class="state-box">Загрузка мероприятия...</div>
    <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
    <template v-else-if="event">
      <h1>{{ event.title }}</h1>
      <p class="view-description">{{ event.description }}</p>

      <div class="details-grid">
        <div class="details-card">
          <span class="details-card__label">Дата</span>
          <strong>{{ formattedDate }}</strong>
        </div>
        <div class="details-card">
          <span class="details-card__label">Время</span>
          <strong>{{ event.time }}</strong>
        </div>
        <div class="details-card">
          <span class="details-card__label">Город</span>
          <strong>{{ event.city }}</strong>
        </div>
        <div class="details-card">
          <span class="details-card__label">Площадка</span>
          <strong>{{ event.venue }}</strong>
        </div>
        <div class="details-card">
          <span class="details-card__label">Категория</span>
          <strong>{{ event.category }}</strong>
        </div>
        <div class="details-card">
          <span class="details-card__label">Цена</span>
          <strong>{{ formattedPrice }}</strong>
        </div>
      </div>

      <div class="event-banner">
        <img class="event-banner__image" :src="event.image" :alt="event.title" />
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEvents } from '../composables/useEvents';

const route = useRoute();
const { currentEvent: event, isLoading, error, loadEventById } = useEvents();

const formattedDate = computed(() => {
  if (!event.value) {
    return '';
  }

  const parsedDate = new Date(event.value.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return event.value.date;
  }

  return parsedDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
});

const formattedPrice = computed(() => `${Number(event.value?.price || 0).toLocaleString('ru-RU')} ₽`);

async function fetchCurrentEvent() {
  try {
    await loadEventById(route.params.id);
  } catch (requestError) {
    // Error state is handled inside the composable.
  }
}

onMounted(fetchCurrentEvent);
watch(() => route.params.id, fetchCurrentEvent);
</script>

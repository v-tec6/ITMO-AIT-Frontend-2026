<template>
  <section class="view-section">
    <p class="eyebrow">Главная</p>
    <h1>Каталог мероприятий</h1>
    <p class="view-description home-view__intro">
      Актуальные события из mock API. Этот экран уже использует реальную загрузку списка мероприятий.
    </p>

    <div v-if="isLoading" class="state-box">Загрузка мероприятий...</div>
    <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
    <div v-else-if="!events.length" class="state-box">Пока нет доступных мероприятий.</div>
    <div v-else class="events-grid">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import EventCard from '../components/EventCard.vue';
import { useEvents } from '../composables/useEvents';

const { events, isLoading, error, loadEvents } = useEvents();

onMounted(async () => {
  try {
    await loadEvents();
  } catch (requestError) {
    // Error state is handled inside the composable.
  }
});
</script>

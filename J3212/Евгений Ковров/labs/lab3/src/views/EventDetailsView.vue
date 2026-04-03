<template>
  <section class="view-section">
    <p class="eyebrow">Мероприятие</p>
    <div v-if="isLoading" class="state-box">Загрузка мероприятия...</div>
    <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
    <template v-else-if="event">
      <div class="event-layout">
        <div class="event-layout__main">
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
            <div class="details-card">
              <span class="details-card__label">Доступно билетов</span>
              <strong>{{ ticketsText }}</strong>
            </div>
            <div v-if="event.age" class="details-card">
              <span class="details-card__label">Возраст</span>
              <strong>{{ event.age }}</strong>
            </div>
          </div>

          <div class="event-banner">
            <img class="event-banner__image" :src="event.image" :alt="event.title" />
          </div>
        </div>

        <PurchasePanel
          :event="event"
          :quantity="quantity"
          :is-authenticated="isAuthenticated"
          :is-submitting="isSubmitting"
          :error-message="purchaseError"
          :success-message="purchaseSuccessMessage"
          :login-link="loginLink"
          @update:quantity="quantity = $event"
          @purchase="handlePurchase"
        />
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PurchasePanel from '../components/PurchasePanel.vue';
import { useAuth } from '../composables/useAuth';
import { useEvents } from '../composables/useEvents';
import { useOrders } from '../composables/useOrders';

const router = useRouter();
const route = useRoute();
const { currentEvent: event, isLoading, error, loadEventById } = useEvents();
const { currentUser, isAuthenticated } = useAuth();
const {
  isSubmitting,
  error: purchaseError,
  successMessage: purchaseSuccessMessage,
  clearStatus,
  purchaseTickets
} = useOrders();
const quantity = ref(1);

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
const ticketsText = computed(() => {
  const availableTickets = Number(event.value?.availableTickets || 0);
  return availableTickets > 0 ? `${availableTickets} шт.` : 'Нет в наличии';
});
const loginLink = computed(() => ({
  name: 'login',
  query: {
    redirect: route.fullPath
  }
}));

async function fetchCurrentEvent() {
  clearStatus();
  quantity.value = 1;

  try {
    await loadEventById(route.params.id);
  } catch (requestError) {
    // Error state is handled inside the composable.
  }
}

async function handlePurchase() {
  if (!event.value) {
    return;
  }

  if (!isAuthenticated.value) {
    await router.push(loginLink.value);
    return;
  }

  try {
    const { updatedEvent } = await purchaseTickets({
      user: currentUser.value,
      event: event.value,
      quantity: quantity.value
    });

    event.value = {
      ...event.value,
      ...updatedEvent
    };
    quantity.value = 1;
  } catch (requestError) {
    if (requestError.code === 'EVENT_NOT_FOUND' || requestError.response?.status === 404) {
      try {
        await fetchCurrentEvent();
      } catch (reloadError) {
        // Error state is already handled in the composable.
      }
    } else if (requestError.event) {
      event.value = {
        ...event.value,
        ...requestError.event
      };
    }
  }
}

onMounted(fetchCurrentEvent);
watch(() => route.params.id, fetchCurrentEvent);
</script>

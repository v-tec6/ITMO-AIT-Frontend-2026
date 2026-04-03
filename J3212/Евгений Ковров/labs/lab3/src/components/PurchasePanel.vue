<template>
  <section class="purchase-panel">
    <div class="purchase-panel__header">
      <div>
        <p class="purchase-panel__eyebrow">Покупка билетов</p>
        <h2 class="purchase-panel__title">Оформление заказа</h2>
      </div>
      <div class="purchase-panel__price">{{ formattedPrice }}</div>
    </div>

    <div class="purchase-panel__grid">
      <div class="details-card">
        <span class="details-card__label">Статус продажи</span>
        <strong>{{ saleStatusText }}</strong>
      </div>
      <div class="details-card">
        <span class="details-card__label">Доступно билетов</span>
        <strong>{{ ticketsText }}</strong>
      </div>
    </div>

    <div v-if="successMessage" class="state-box state-box--success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="state-box state-box--error">{{ errorMessage }}</div>

    <div v-if="!isAuthenticated" class="purchase-panel__guest">
      <p class="view-description">Чтобы купить билет, войдите в аккаунт.</p>
      <RouterLink class="button-link" :to="loginLink">Войти и продолжить</RouterLink>
    </div>

    <div v-else-if="!isPublished" class="state-box">
      <span v-if="status === 'Приостановлено'">
        Продажа билетов на это мероприятие временно приостановлена.
      </span>
      <span v-else>
        Мероприятие снято с публикации и недоступно для покупки.
      </span>
    </div>

    <div v-else-if="availableTickets <= 0" class="state-box">
      Билеты на это мероприятие закончились.
    </div>

    <form v-else class="purchase-panel__form" @submit.prevent="$emit('purchase')">
      <label class="auth-form__field purchase-panel__field" for="ticketQuantity">
        <span>Количество билетов</span>
        <select
          id="ticketQuantity"
          :value="quantity"
          class="purchase-panel__select"
          :disabled="isSubmitting"
          @change="$emit('update:quantity', Number($event.target.value))"
        >
          <option v-for="value in quantityOptions" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
      </label>

      <button class="button-link purchase-panel__submit" type="submit" :disabled="isSubmitting">
        {{ buttonText }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  successMessage: {
    type: String,
    default: ''
  },
  loginLink: {
    type: Object,
    required: true
  }
});

defineEmits(['purchase', 'update:quantity']);

const status = computed(() => props.event.status || 'Опубликовано');
const isPublished = computed(() => status.value === 'Опубликовано');
const availableTickets = computed(() => Number(props.event.availableTickets || 0));

const quantityOptions = computed(() => {
  const limit = Math.max(1, Math.min(availableTickets.value, 4));
  return Array.from({ length: limit }, (_, index) => index + 1);
});

const formattedPrice = computed(() => `${Number(props.event.price || 0).toLocaleString('ru-RU')} ₽`);

const ticketsText = computed(() => {
  return availableTickets.value > 0 ? `${availableTickets.value} шт.` : 'Нет в наличии';
});

const saleStatusText = computed(() => {
  if (status.value === 'Приостановлено') {
    return 'Продажа приостановлена';
  }

  if (status.value === 'Черновик') {
    return 'Не опубликовано';
  }

  return availableTickets.value > 0 ? 'Билеты доступны' : 'Нет в наличии';
});

const buttonText = computed(() => {
  if (props.isSubmitting) {
    return 'Оформляем заказ...';
  }

  return 'Купить билет';
});
</script>

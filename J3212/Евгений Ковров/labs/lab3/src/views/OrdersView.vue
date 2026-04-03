<template>
  <section class="view-section">
    <p class="eyebrow">Аккаунт</p>
    <h1>Мои билеты</h1>
    <p class="view-description">Ваши покупки и статусы заказов в одном месте.</p>

    <div v-if="!currentUser" class="state-box">Не удалось определить текущего пользователя.</div>
    <div v-else-if="isLoading" class="state-box">Загрузка заказов...</div>
    <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
    <div v-else-if="!orderEntries.length" class="state-box">
      Пока нет заказов. После покупки билетов они появятся в этом разделе.
    </div>
    <div v-else class="orders-list">
      <OrderCard v-for="entry in orderEntries" :key="entry.order.id" :entry="entry" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import OrderCard from '../components/OrderCard.vue';
import { useAuth } from '../composables/useAuth';
import { useOrders } from '../composables/useOrders';

const { currentUser } = useAuth();
const { orderEntries, isLoading, error, loadOrdersByUser } = useOrders();

onMounted(async () => {
  if (!currentUser.value?.id) {
    return;
  }

  try {
    await loadOrdersByUser(currentUser.value.id);
  } catch (requestError) {
    // Error state is handled in the composable.
  }
});
</script>

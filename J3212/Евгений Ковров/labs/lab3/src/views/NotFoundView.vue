<template>
  <section class="view-section view-section--narrow">
    <p class="eyebrow">404</p>
    <h1>Страница не найдена</h1>
    <p class="view-description">
      Проверьте адрес или вернитесь в каталог мероприятий.
    </p>
    <RouterLink class="button-link" to="/">На главную</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

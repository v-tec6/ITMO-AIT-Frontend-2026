<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="brand" to="/">
        <span class="brand__badge">КМ</span>
        <span>Контрамарка</span>
      </RouterLink>

      <nav class="app-nav" aria-label="Основная навигация">
        <RouterLink to="/">События</RouterLink>
        <RouterLink to="/orders">Мои билеты</RouterLink>
        <RouterLink to="/profile">Профиль</RouterLink>
        <RouterLink to="/organizer">Организатору</RouterLink>
        <RouterLink to="/login">Войти</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

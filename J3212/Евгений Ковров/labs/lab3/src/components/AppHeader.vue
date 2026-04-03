<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink class="brand" to="/">
        <span class="brand__badge">КМ</span>
        <span>Контрамарка</span>
      </RouterLink>

      <nav class="app-nav" aria-label="Основная навигация">
        <RouterLink to="/">События</RouterLink>
        <RouterLink to="/organizer">Организатору</RouterLink>
        <template v-if="isAuthenticated">
          <RouterLink to="/orders">Мои билеты</RouterLink>
          <RouterLink to="/profile">Профиль</RouterLink>
          <span class="app-nav__user">{{ displayName }}</span>
          <button class="app-nav__button" type="button" @click="handleLogout">Выйти</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Войти</RouterLink>
          <RouterLink class="app-nav__accent" to="/register">Регистрация</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { currentUser, isAuthenticated, logout } = useAuth();

const displayName = computed(() => currentUser.value?.name || currentUser.value?.email || 'Пользователь');

function handleLogout() {
  logout();
  router.push('/');
}
</script>

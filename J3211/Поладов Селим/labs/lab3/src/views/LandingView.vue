<template>
  <div class="auth-page">
    <div class="auth-card text-center">
      <router-link to="/login" class="brand brand-hero text-decoration-none d-inline-block mb-4">67 Финансы</router-link>
      <h2>Управление личными финансами</h2>
      <p class="subtitle">Следите за счетами, транзакциями и бюджетом в одном месте</p>
      <div class="d-flex gap-2 justify-content-center flex-wrap">
        <router-link to="/login" class="btn btn-primary px-4">Войти</router-link>
        <router-link to="/register" class="btn btn-outline-secondary px-4">Регистрация</router-link>
        <router-link to="/dashboard" class="btn btn-outline-secondary px-4">Личный кабинет</router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>

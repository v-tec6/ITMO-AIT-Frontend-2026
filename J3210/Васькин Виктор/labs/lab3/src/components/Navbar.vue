<script setup>
import { useTheme } from '@/composables/useTheme'
import { RouterLink } from 'vue-router'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <nav class="navbar navbar-expand-lg custom-navbar py-3" aria-label="Главная навигация">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold fs-3 text-white" to="/">
        Posi<span class="neon-text">Max</span>
      </RouterLink>
      
      <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Открыть меню навигации">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link text-white fw-bold" to="/">Каталог</RouterLink>
          </li>
        </ul>
        
        <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          <button @click="toggleTheme" class="btn btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;" aria-label="Сменить тему">
            <svg width="20" height="20">
              <use :href="theme === 'dark' ? '/img/sprite.svg#sun' : '/img/sprite.svg#moon'"></use>
            </svg>
          </button>
          
         <div class="d-flex flex-column flex-lg-row gap-2">
            <RouterLink to="/login" class="btn btn-outline-light rounded-pill px-4 fw-bold">Войти</RouterLink>
            <RouterLink to="/register" class="btn btn-neon rounded-pill px-4 fw-bold">Регистрация</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
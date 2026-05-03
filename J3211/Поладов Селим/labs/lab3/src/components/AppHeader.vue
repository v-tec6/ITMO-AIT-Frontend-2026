<template>
  <div class="header-row">
    <h1>{{ title }}</h1>
    <div class="header-actions">
      <div class="dropdown">
        <button type="button" class="user-menu dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <div class="user-avatar">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <span class="d-none d-md-inline">{{ fullName || '—' }}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><router-link class="dropdown-item" to="/settings">Настройки</router-link></li>
          <li><hr class="dropdown-divider" /></li>
          <li><a class="dropdown-item text-danger" href="#" @click.prevent="onLogout">Выйти</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

defineProps({ title: { type: String, required: true } })

const router = useRouter()
const { fullName, logout } = useAuth()

function onLogout() {
  logout()
  router.push('/login')
}
</script>

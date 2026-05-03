<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="brand text-decoration-none d-inline-block">67 Финансы</router-link>
      <h2>Создать аккаунт</h2>
      <p class="subtitle">Введите свои данные для регистрации</p>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Имя</label>
          <input v-model="form.firstName" type="text" class="form-control" placeholder="Иван" autocomplete="off" />
        </div>
        <div class="mb-3">
          <label class="form-label">Фамилия</label>
          <input v-model="form.lastName" type="text" class="form-control" placeholder="Иванов" autocomplete="off" />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" placeholder="example@gmail.com" autocomplete="off" />
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input v-model="form.password" type="password" class="form-control" placeholder="••••••••" autocomplete="off" />
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3">Ошибка регистрации. Возможно, этот email уже занят.</div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Создать аккаунт</button>
      </form>
      <p class="mt-4 text-center text-muted small">
        Уже есть аккаунт? <router-link to="/login" class="auth-link">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { register } = useAuth()
const form = reactive({ firstName: '', lastName: '', email: '', password: '' })
const error = ref(false)

async function onSubmit() {
  error.value = false
  try {
    await register({ ...form })
    router.push('/dashboard')
  } catch {
    error.value = true
  }
}
</script>

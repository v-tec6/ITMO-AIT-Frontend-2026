<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="brand text-decoration-none d-inline-block">67 Финансы</router-link>
      <h2>Вход</h2>
      <p class="subtitle">Введите данные для входа в аккаунт</p>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" placeholder="example@gmail.com" autocomplete="off" />
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input v-model="form.password" type="password" class="form-control" placeholder="••••••••" autocomplete="off" />
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-3">Неверный email или пароль</div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Войти</button>
      </form>
      <p class="mt-4 text-center text-muted small">
        Нет аккаунта? <router-link to="/register" class="auth-link">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref(false)

async function onSubmit() {
  error.value = false
  try {
    await login({ ...form })
    router.push('/dashboard')
  } catch {
    error.value = true
  }
}
</script>

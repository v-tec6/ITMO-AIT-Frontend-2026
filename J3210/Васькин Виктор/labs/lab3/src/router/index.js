import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '../views/CatalogView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    { path: '/', name: 'catalog', component: CatalogView },
    { path: '/login', name: 'login', component: LoginView }
  ]
})

export default router
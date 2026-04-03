import { createRouter, createWebHistory } from 'vue-router';
import EventDetailsView from '../views/EventDetailsView.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import OrdersView from '../views/OrdersView.vue';
import OrganizerView from '../views/OrganizerView.vue';
import ProfileView from '../views/ProfileView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/events/:id', name: 'event-details', component: EventDetailsView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/orders', name: 'orders', component: OrdersView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/organizer', name: 'organizer', component: OrganizerView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;

import { computed, ref } from 'vue';

const currentUser = ref(null);

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value));

  return {
    currentUser,
    isAuthenticated
  };
}

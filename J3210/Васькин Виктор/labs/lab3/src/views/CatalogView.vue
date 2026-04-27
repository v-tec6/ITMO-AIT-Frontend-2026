<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BaseLayout from '@/layouts/BaseLayout.vue'
import CourseCard from '@/components/CourseCard.vue'

const courses = ref([])
const loading = ref(true)

const fetchCourses = async () => {
  try {
    const response = await axios.get('http://localhost:4000/courses')
    courses.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <BaseLayout>
    <h1 class="text-white fw-bold mb-4">Каталог курсов</h1>

    <div class="filter-top-bar p-3 p-md-4 rounded-4 mb-4">
      <p class="text-white-50 mb-0">Здесь скоро будут фильтры на Vue...</p>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-neon" role="status"></div>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
      <CourseCard 
        v-for="course in courses" 
        :key="course.id" 
        :course="course" 
      />
    </div>
  </BaseLayout>
</template>
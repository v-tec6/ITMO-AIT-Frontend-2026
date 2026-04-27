<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const priceText = computed(() => props.course.price === 0 ? 'Бесплатно' : `${props.course.price} ₽`)
const priceClass = computed(() => props.course.price === 0 ? 'text-white' : 'neon-text')
const btnClass = computed(() => props.course.price === 0 ? 'btn-outline-light' : 'btn-neon')
const stars = computed(() => '★'.repeat(props.course.rating) + '☆'.repeat(5 - props.course.rating))

const webpSrc = computed(() => {
  return props.course.image.startsWith('data:') 
    ? props.course.image 
    : props.course.image.replace('.png', '.webp')
})
</script>

<template>
  <div class="col">
    <div class="card course-card h-100 bg-dark text-white border-secondary rounded-4 overflow-hidden d-flex flex-column">
      <picture>
        <source :srcset="webpSrc" type="image/webp">
        <img :src="course.image" class="card-img-top image-placeholder" :alt="'Обложка курса: ' + course.title" loading="lazy" style="width: 100%; height: 180px; object-fit: cover;">
      </picture>
      
      <div class="card-body d-flex flex-column">
        <h2 class="card-title h5 fw-bold mb-1">{{ course.title }}</h2>
        
        <div class="text-warning small mb-2" :aria-label="'Рейтинг: ' + course.rating + ' из 5'">
          <span aria-hidden="true">{{ stars }}</span> 
          <span class="text-white-50 ms-1">({{ course.reviews }})</span>
        </div>
        
        <p class="card-text text-white-50 small flex-grow-1">{{ course.desc }}</p>
        
        <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
          <span class="fs-5 fw-bold" :class="priceClass">{{ priceText }}</span>
          <RouterLink :to="'/course/' + course.id" class="btn btn-sm rounded-pill px-3 fw-bold" :class="btnClass">
            Подробнее
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<template>
  <div class="content-card mb-3">
    <div class="row g-2 filter-row">
      <div class="col-12 col-md-4">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input
            type="search"
            class="form-control border-start-0"
            placeholder="Поиск по транзакциям"
            :value="filters.q"
            @input="update('q', $event.target.value)"
          />
        </div>
      </div>
      <div class="col-6 col-md-2">
        <select class="form-select" :value="filters.category" @change="update('category', $event.target.value)">
          <option value="">Категория</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>
      </div>
      <div class="col-6 col-md-2">
        <input
          type="number"
          class="form-control"
          placeholder="Сумма от"
          :value="filters.amountFrom"
          @input="update('amountFrom', $event.target.value)"
        />
      </div>
      <div class="col-6 col-md-2">
        <input
          type="date"
          class="form-control"
          :value="filters.dateFrom"
          @change="update('dateFrom', $event.target.value)"
        />
      </div>
      <div class="col-6 col-md-2">
        <input
          type="date"
          class="form-control"
          :value="filters.dateTo"
          @change="update('dateTo', $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ filters: { type: Object, required: true } })

const categories = [
  'Доход', 'Продукты', 'Транспорт', 'Развлечения',
  'Жильё', 'Техника', 'Авто', 'Крупная покупка', 'Накопления'
]

function update(key, value) {
  props.filters[key] = value
}
</script>

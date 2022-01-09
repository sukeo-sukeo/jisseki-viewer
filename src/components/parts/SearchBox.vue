<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: String
})
const emits = defineEmits(
  ["input-word", "search-btn-click"],
  )

const word = ref("")
</script>

<template>
  <div class="d-flex justify-content-center w-50 mx-auto" style="min-width: 300px;">
    <input v-model="word"
     @input="emits('input-word', word)"
     class="form-control me-2" type="search" :placeholder="props.placeholder || 'Search'" aria-label="Search">
    <button class="btn btn-outline-success"
     @click.prevent.stop="emits('search-btn-click')">Search</button>
  </div>
</template>

<style>

</style>
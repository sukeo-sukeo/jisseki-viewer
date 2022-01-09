<script setup>
const emits = defineEmits([
  "process-start"
])

</script>
<template>
  <div class="card" style="width: 12rem;">
    <slot name="menu-icon"></slot>
    <div class="card-body">
      <h5 class="card-title">
        <slot name="menu-title"></slot>
      </h5>
      <p class="card-text">
        <slot name="description"></slot>
      </p>
      <button type="button" class="btn btn-primary"
      @click="emits('process-start')">
        <slot name="execute"></slot>  
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
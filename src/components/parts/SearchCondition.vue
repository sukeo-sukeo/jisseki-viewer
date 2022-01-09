<script setup>
const props = defineProps({
  conditionList: Object
})
const emits = defineEmits([
  "condition-choice"
]);

</script>

<template>
  <div class="d-flex">
    <div class="form-check mx-3"
     style="cursor: pointer;"
     v-for="(cond, key, i) in props.conditionList" :key="cond"
     @click="emits('condition-choice', cond)">
      <input class="form-check-input" 
      style="cursor: pointer;" type="radio" name="flexRadioDefault" :id="`flexRadioDefault${i}`"
      :checked="key === '商品名' ? true : false">
      <label class="form-check-label"
      style="cursor: pointer;" :for="`flexRadioDefault${i}`">
        {{ key }}
      </label>
    </div>
  </div>
</template>

<style>

</style>
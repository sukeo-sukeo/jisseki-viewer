<script setup>
  import Analysis from "./contents/Analysis.vue";
  import Search from "./contents/Search.vue";
  const emits = defineEmits(["search-menu-click"])
</script>

<template>
  <main class="mt-5">
    <div class="row">
      <div class="col d-flex flex-wrap justify-content-evenly">
        <Analysis/> 
        <Search
         @search-menu-click="emits('search-menu-click')" />
      </div>
    </div>
  </main>
</template>


<style>

</style>
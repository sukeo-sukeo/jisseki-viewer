<script setup>
import MenuBox from "../parts/MenuBox.vue";

const emits = defineEmits(["search-menu-click"])

</script>

<template>
  <div class="rounded text-center"> 
    <menu-box
     @process-start="emits('search-menu-click')">
      <template v-slot:menu-icon>
        <i class="bi bi-search" style="font-size:64px;"></i>
      </template>
      <template v-slot:menu-title>
        マスター検索
      </template>
      <template v-slot:description>
        商品を検索します
      </template>
      <template v-slot:execute>
        検索する
      </template>
    </menu-box>
  </div>

</template>

<style scoped>

</style>

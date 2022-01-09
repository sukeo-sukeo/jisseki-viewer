<script setup>
import Header from "./components/share/Header.vue";
import Footer from "./components/share/Footer.vue";
import MainPage from './components/MainPage.vue';
import SearchPage from "./components/SearchPage.vue";
import { ref } from "vue";

let onSearch = ref(false);


</script>

<template>
  
  <div class="container-fulid">
    <Header />
    <component :is="onSearch ? SearchPage : MainPage"
    @search-menu-click="onSearch = !onSearch"></component>
    <Footer v-if="!onSearch" />
  </div>
 
</template>

<style>

</style>

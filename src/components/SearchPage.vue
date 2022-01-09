<script setup>
import { onMounted, ref } from "vue";
import SearchBox from "./parts/SearchBox.vue";
import SearchCondition from "./parts/SearchCondition.vue";
import SubCondition from "./parts/SearchSubCondition.vue";
import SpreadTable from "./parts/SpreadTable.vue"
import { fetchData } from "../lib/client/search.js";

const word = ref("")
const input = (w) => word.value = w;

const conditionList = {
  商品名: "商品名",
  商品コード: "コード", 
  JANコード: "JAN1"
}

const condition = ref(conditionList.商品名);
const setCondition = (val) => condition.value = val;

const subCondition = ref({}); 
const getSubCondition = async () => {
  const [cat, sup] = await window.myapi.getSubCondition();
  subCondition.value.cat = cat;
  subCondition.value.sup = sup;
  subCondition.value.supBase = sup;
};
onMounted(() => getSubCondition());

const filteringSup = (bumons) => {
  subCondition.value.sup = subCondition.value.supBase.filter(sup => bumons.includes(sup["部門"]))
}


const masterData = ref("");
const fetchStart = async () => {
  masterData.value = "";
  masterData.value = await fetchData(word.value, condition.value)
}

</script>

<template>
  <main class="mt-5">
    <div class="row">
      <div class="col">
        <SearchBox
        @input-word="input"
        @search-btn-click="fetchStart" />
      </div>
    </div>
    <div class="row mt-3">
      <div class="col d-flex justify-content-center">
        <SearchCondition
        :conditionList="conditionList"
        @condition-choice="setCondition" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <SubCondition
         :data="subCondition"
         @bumon-checked="filteringSup" />
      </div>
    </div>
    <div class="row">
      <div class="col m-3 d-flex justify-content-center">
        <span v-if="masterData" class="badge bg-primary fs-3">{{ masterData.length }}件ヒット</span>
      </div>
    </div>
    <div class="row overflow-scroll">
      <div class="col">
        <SpreadTable :data="masterData"/>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
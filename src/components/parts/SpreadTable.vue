<script setup>
import "jsuites/dist/jsuites.js";
import "jsuites/dist/jsuites.css";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import { createSpreadData } from "../../lib/client/spread.js";
import jSpreadsheet from "jspreadsheet-ce";
import { ref, watch } from "vue"

const props = defineProps({
  data: [String, Object, Array]
})

const data = ref(props);
const sheet = ref(null);

watch(data, () => {
  // 検索結果が無い時はundefined
  if (data.value.data === undefined) return; 
  while (sheet.value.firstChild) {
    sheet.value.removeChild(sheet.value.firstChild);
  }

  if (!Object.keys(data.value.data).length) return;
  const sheetOptions = createSpreadData(data.value.data)
  
  jSpreadsheet(sheet.value, sheetOptions);
  },{deep: true});


</script>

<template>
  <div ref="sheet"></div>
</template>

<style scoped>
.jexcel_pagination {
  justify-content: flex-start !important;
}
</style>
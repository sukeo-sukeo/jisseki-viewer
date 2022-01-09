<script setup>
import { ref } from "vue";

const props = defineProps({
  data: [Object, Array, String],
  bumons: Array
});

const emits = defineEmits([
  "bumon-checked"
])

const bumons = ref([]);
const bumonChecked = (e) => {
  const bumon = Number(e.target.value);
  if (bumons.value.length) {
    let flg;
    let idx = bumons.value.indexOf(bumon);

    idx === -1 ? 
      flg = false:
      flg = true;

    flg ? 
      bumons.value.splice(idx, 1) :
      bumons.value.push(bumon);

  } else {
    bumons.value.push(bumon);
  }
  console.log(bumons.value);
  emits('bumon-checked', bumons.value)
}
</script>

<template>
  <!-- categories -->
  <div class="container-fulid m-3">
    <div class="row">
      <div class="col d-flex flex-wrap">
        <div class="form-check mx-2" v-for="cat in props.data.cat" :key="cat['部門']">
          <input class="form-check-input" type="checkbox" :value="cat['部門']" :id="`bumon_${cat['部門']}`"
          @click="bumonChecked">
          <label class="form-check-label" :for="`bumon_${cat['部門']}`">
            {{cat["部門"]}}: {{cat["部門名"]}}
          </label>
        </div>
      </div>
    </div>
  </div>
  <!-- suppliers -->
  <select class="form-select" multiple aria-label="multiple select example">
    <option>{{ props.data.sup ? props.data.sup.length : "" }}メーカー</option>
    <option v-for="sup in props.data.sup" :key="sup['メーカーコード']" :value="sup['メーカーコード']" v-show="sup['メーカー名']">
      <input type="checkbox" name="" id="">
      {{sup["メーカーコード"]}}: {{sup["メーカー名"]}}
    </option>
  </select>
  <!-- {{ props.data }} -->
</template>

<style>

</style>
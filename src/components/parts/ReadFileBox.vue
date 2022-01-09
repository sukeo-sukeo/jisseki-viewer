<script setup>
const props = defineProps({
  isReading: Boolean
})
console.log(props.isReading);
const emits = defineEmits([
  "choice-file",
  "close-modal"
]);
</script>

<template>
  <!-- Modal -->
  <div id="overlay">

    <div class="card">
      <h5 class="card-header">
        <slot name="process-title"></slot>
      </h5>
      <div class="card-body">
        <p class="card-text">
          <slot name="process-description"></slot>
        </p>
        <hr>
        <div class="process-img-wrapper">
          <small class="float-end bg-secondary text-light p-1 rounded" style="opacity: .6;">data-image</small>
          <slot name="process-img"></slot>
        </div>
        <template v-if="props.isReading">
          <div class="spinner-grow center-icon" style="width:3rem; height:3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </template>
        <template v-else>
          <i class="bi bi-download text-secondary animated center-icon text-success" style="font-size:64px;"></i>
        </template>

        <div class="drop-zone mt-3 border border-3 border-secondary rounded d-flex justify-content-center align-items-center">
          <i class="bi bi-file-earmark-spreadsheet text-secondary" style="font-size: 64px;"></i> 
          <p class="text-secondary text-center m-3">
            .xls .xlsx .csv
          </p>
        </div>
        <input type="file"
        @change="emits('choice-file', $event)">
      </div>
      <button class="btn btn-primary"
       @click="emits('close-modal')">close</button>
    </div>

  </div>
</template>

<style scoped>
.center-icon {
  position: absolute;
  left: 45%;
  top: 55%;
}
.drop-zone {
  height: 120px;
  cursor: pointer;
}
/* .drop-zone:hover {
  background: gray;
  color: black;
} */
.card {
  max-width: 500px;
  min-width: 500px;
  height: 510px;
}
.card-body {
  position: relative;
}
.process-img-wrapper {
  height: 200px;
  overflow: hidden;
}
input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  /* background: red; */
  top: 0;
  left: 0;
}

.animated {
  animation: move-y .5s infinite alternate ease-in-out;
  display: inline-block;
  /* color: red; */
}
@keyframes move-y {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(10px);
  }
}

</style>
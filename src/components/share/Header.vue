<script setup>
import { ref } from "vue";
import ReadFileBox from "../parts/ReadFileBox.vue";
import SearchBox from "../parts/SearchBox.vue";
import path from "path";

const word = ref("")
const input = (w) => word.value = w;

const result = ref("")
const fetchData = async () => {
  console.log(word.value);
  result.value = word.value + "result返すよ!"
}

let filePath = ref("");
let updateDate = ref("");

(async () => {
  updateDate.value = await window.myapi.checkMasterUpdated();
  // updateDate.value = updateDate.value.split("_")[0];
})();


const readFilePath = async (e) => {
  
  if (confirm("マスターを更新します。")) {
    const file = e.target.files[0];
    filePath.value = file.path;
    const updated = await window.myapi.updateMaster(filePath.value);
    filePath.value = ""
    console.log(updated);
    updateDate.value = updated;
    if (updated) {
      alert(`マスターを更新しました。${updated.replace("_", " ")}`)
    }
    isShow_modal.value = false;
    return
  } else {
    filePath.value = "";
    isShow_modal.value = false;
    return
  }
}

const isShow_modal = ref(false);

</script>

<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">JISSEK
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="">ホーム</a>
        </li>
        <li class="nav-item">
          <span class="nav-link d-flex align-items-center"
           @click="isShow_modal = !isShow_modal">マスター 
            <small class="badge bg-secondary ms-1">
              更新日:{{ updateDate.split("_")[0] }}
            </small>
          </span>
        </li>
      </ul>
      <!-- quick search機能実装予定 -->
      <!-- <SearchBox
       :placeholder="'QuickSearch'"
       @input-word="input"
       @search-btn-click="fetchData"/> -->
    </div>
  </div>
</nav>

<read-file-box
 v-if="isShow_modal"
 :isReading="filePath ? true : false"
 @choice-file="readFilePath"
 @close-modal="isShow_modal = !isShow_modal">
  <template v-slot:process-title>
    マスター更新
  </template>
  <template v-slot:process-description>
    マスターデータを投入してください。
  </template>
  <template v-slot:process-img>
    <img src="../../../public/images/master_sample2.png" class="card-img-top">
  </template>
</read-file-box>


</template>

<style scoped>
.nav-item {
  cursor: pointer;
}
</style>
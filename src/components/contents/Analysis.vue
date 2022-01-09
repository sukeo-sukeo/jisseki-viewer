<script setup>
import { ref } from "vue";
import MenuBox from "../parts/MenuBox.vue";
import ReadFileBox from "../parts/ReadFileBox.vue";
import path from "path";

let hasTemplate = ref(false);
(async () => {
  // templatedirに「分析シート原本」があるかチェック
  hasTemplate.value = await window.myapi.checkTemplate("分析シート");
  console.log(hasTemplate.value);
})();

let filePath = ref("");
const readFilePath = async (e) => {
  // 「分析シート」の存在確認
  if (!hasTemplate.value) {
    alert("「分析シート原本.xlsx」がありません。");
    const s_or_f = await window.myapi.getTemplate();
    console.log(s_or_f);
    if (s_or_f.status === undefined) {
      filePath.value = "";
      isShow_modal.value = false;
      console.log(s_or_f);
      "msg" in s_or_f ? alert(s_or_f.msg) : "";
      return 
    }
    console.log("ok!", s_or_f);
  }
  
  if (confirm("分析表を作成します。")) {
    filePath.value = e.target.files[0].path;
    const result = await window.myapi.createAnalysisFile(filePath.value);
    filePath.value = "";
    console.log(result);
    if (result) {
      alert(`${result}に出力しました。`)
    }
    isShow_modal.value = false
    return
  } else {
    filePath.value = "";
    isShow_modal.value = false
    return
  }
}

const isShow_modal = ref(false);

</script>

<template>
  <div class="rounded text-center"> 
    <menu-box
    @process-start="isShow_modal = !isShow_modal">
      <template v-slot:menu-icon>
        <i class="bi bi-clipboard-data bg-light" style="font-size: 64px;"></i>
      </template>
      <template v-slot:menu-title>
        分析表の作成
      </template>
      <template v-slot:description>
        分析表を作成します
      </template>
      <template v-slot:execute>
        作成する
      </template>
    </menu-box>
  </div>
  
  
  <read-file-box
  v-if="isShow_modal"
  :isReading="filePath ? true : false"
  @choice-file="readFilePath"
  @close-modal="isShow_modal = !isShow_modal">
    <template v-slot:process-img>
      <img src="../../../public/images/analysis_sample2.png" class="card-img-top">
    </template>
    <template v-slot:process-title>
      分析表の作成
    </template>
    <template v-slot:process-description>
      実績データを投入してください。<small>(カラム名の一致が必要です)</small>
    </template>
  </read-file-box>
 
</template>

<style scoped>

</style>

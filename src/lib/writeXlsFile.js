import XlsxPopulate from "xlsx-populate";
import { readXlsToJSON } from "./readXlsFile.js";
import { db_master as db } from "./database/nedb.js";
import { appPaths } from "../background.js"
import path from "path";
import fs from "fs/promises";
import { today } from "./util/getDate.js";

// ここでappPathを使いたいが初期化時には存在しないためエラーとなる
const TEMPLATE_FILE_NAME = "分析シート原本.xlsx"
const OUTPUT_FILE_NAME = `分析シート(${today.replace(/\//g, "")}).xls`;
const TEMPLATE_SHEET_NAME = "分析表";
const TEMPLATE_START_ROW = 9;
const COLUMNS_SCHEMA = {
  H_2019: "O",
  H_2020: "P",
  H_2021: "Q",
  U_2019: "U",
  U_2020: "V",
  U_2021: "W",
  R_2019: "AA",
  R_2020: "AB",
  R_2021: "AC",
};

export const createAnalysisFile = async (jisseki_path) => {
  // file checking
  const TEMPLATE_FILE_PATH = path.join(
    appPaths.templateDirPath,
    TEMPLATE_FILE_NAME
  );
  const OUTPUT_FILE_PATH = path.join(
    appPaths.outputDirPath,
    OUTPUT_FILE_NAME
  );
  try {
    // ファイルが無かった場合はgetTemplateする処理を追加よてい
    // (初回起動時あったけどその後削除された場合など想定)
    // すでにファイルがあったら(2)とかにする⇨現在は上書き
    await fs.copyFile(TEMPLATE_FILE_PATH, OUTPUT_FILE_PATH);
  } catch (e) {
    console.log(e.message);
    console.log("コピー失敗");
    return false
  }

  // create json
  const MASTER_JSON = await db.find({});
  if (!MASTER_JSON.length) {
    const msg = "マスターデータがありません。";
    console.log(msg);
    return msg
  }
  const JISSEKI_JSON = readXlsToJSON(jisseki_path);
  
  
  // prepare xlsfile to be written
  const wb = await XlsxPopulate.fromFileAsync(OUTPUT_FILE_PATH);
  const ws = wb.sheet(0);
  const codes = Array.from(new Set(JISSEKI_JSON.map((j) => j.商品コード)));
  const years = Array.from(new Set(JISSEKI_JSON.map((j) => j.年)));
 
  // write
  try {
    writeDataToXls(ws, codes, years, JISSEKI_JSON, MASTER_JSON);
  } catch (e) {
    console.log(e.message);
    console.log("データの書き込み失敗");
    return false
  }
  
  // export xlsfile
  try {
    console.log("ファイル作成中...");
    await wb.toFileAsync(OUTPUT_FILE_PATH);
    return OUTPUT_FILE_PATH
  } catch (e) {
    console.log(e.message);
    return false;
  }

};


const writeDataToXls = (ws, codes, years, jisseki_json, master_json) => {
  // 実績データ書き込み
  codes.forEach((code, i) => {
    const idx = TEMPLATE_START_ROW + i;
    ws.cell(`A${idx}`).value(code);
    jisseki_json.forEach((j) => {
      if (j.商品コード === code) {
        years.forEach((year) => {
          if (j.年 === year) {
            ws.cell(COLUMNS_SCHEMA[`H_${j.年}`] + idx).value(j.販売数);
            ws.cell(COLUMNS_SCHEMA[`U_${j.年}`] + idx).value(j.売上);
            ws.cell(COLUMNS_SCHEMA[`R_${j.年}`] + idx).value(j.利益);
          }
        });
      }
    });
  });

  console.log("実績書き込み完了");

  // masterの書き込み
  codes.forEach((code, i) => {
    const idx = TEMPLATE_START_ROW + i;
    master_json.forEach((j) => {
      if (j.コード === String(code)) {
        ws.cell(`B${idx}`).value(j.JAN1);
        ws.cell(`C${idx}`).value(j.商品名);
        ws.cell(`D${idx}`).value(j.分類名);
        ws.cell(`E${idx}`).value(j.メーカー名);
        ws.cell(`F${idx}`).value(j.部門);
      }
    });
  });

  console.log("マスター書き込み完了");

  // 未使用のセルをクリア
  const lastRow = codes.length + TEMPLATE_START_ROW;
  console.log(lastRow);
  const deleteRow = 20000;
  ws._rows.splice(lastRow, deleteRow);
  ws._rows.map((row, i) => row._node.attributes.r = i);
  console.log("未使用のセルをクリア");
}
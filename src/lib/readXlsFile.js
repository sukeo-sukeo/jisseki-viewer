import XLSX from "xlsx";
import path from "path";

// 実績データの開始行
const READ_XLS_START_ROW_JISSEKI = 1
// マスターデータの開始行
const READ_XLS_START_ROW_MASTER = 4

export const readXlsToJSON = (filePath) => {
  console.log("リードエクセル", filePath);

  let json;

  // asmster
  if (path.basename(filePath).includes("商品マスター")) {
    json = getJSON(filePath, READ_XLS_START_ROW_MASTER);
    // "コード"が数値の場合、文字列に変換
    json = json.map((j) => {
      if (typeof j.コード === "string") return j
      j.コード = String(j.コード); return j
    })
  } else {
    // 実績表
    json = getJSON(filePath, READ_XLS_START_ROW_JISSEKI);
    json = json.map((j) => {
      j.利益 = j.売上 - j.原価;
      return j;
    });
  }
  return json;
};

const getJSON = (filePath, startRow) => {
  const workBook = XLSX.readFile(filePath);
  const sheet_name_list = workBook.SheetNames;
  const sheet = workBook.Sheets[sheet_name_list[0]];
  const endSell = sheet["!ref"].split(":")[1];
  sheet["!ref"] = `A${startRow}:${endSell}`;
  const json = XLSX.utils.sheet_to_json(sheet);
  return json;
};
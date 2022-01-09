import { readXlsToJSON } from "./readXlsFile.js";
import path from "path";
import { db_master as db } from "./database/nedb.js";
import { today, nowTime } from "./util/getDate.js";
import { db_masterupdate, db_category, db_supplier } from "./database/nedb.js"
import { kanaHanToZen } from "./util/kanaMap.js";

const OR = "$or";
const AND = "$and";
const MAX_DATA_COUNT = 500;

export const updateMaster = async (filepath) => {
  if (!path.basename(filepath).includes("商品マスター")) return "商品マスターファイルではありません";
  try {
    // asmaster data
    const json = readXlsToJSON(filepath);
    // bumon, supplier data
    const [cat_json, sup_json] = createJsonCategoryAndSupplier(json);
    // asmaster更新
    await db.remove({}, { multi: true });
    await db.insert(json);
    console.log("asmaster更新...");
    // 部門master更新
    await db_category.remove({}, { multi: true });
    await db_category.insert(cat_json);
    console.log("部門master更新...");
    // メーカー名master更新
    await db_supplier.remove({}, { multi: true });
    await db_supplier.insert(sup_json);
    console.log("メーカー名master更新...");
  } catch (e) {
    console.log(e.message);
    return "申し訳ありません。失敗しました。"
  }
  
  const updated = `${today}_${nowTime}`;
  try {
    db_masterupdate.insert({ time: updated });
    return updated
  } catch (e) {
    console.log(e.message);
    return false
  }
}

export const checkUpdate = async () => {
  const updateds = await db_masterupdate.find({}).sort({time:1})
  console.log(updateds);
  const updated = updateds.length ? updateds.pop().time : ""
  return updated
}

export const getData = async (word, condition="商品名") => {
  let result;
  let logic;

  logic = checkSpaceAndCamma(word);
  word = createRegExp(word, logic, condition);
  
  logic ?
    result = await db.find({ [logic]: word }).limit(MAX_DATA_COUNT) :
    result = await db.find({ [condition]: word }).limit(MAX_DATA_COUNT);
  
  console.log(condition);
  console.log(word);
  console.log(result.length);
  return result
}

export const getSubCondition = async () => {
  let cat, sup;
  cat = await db_category.find({}).sort({"部門": 1});
  sup = await db_supplier.find({}).sort({"メーカーコード": 1});
  return [cat, sup]
} 

const checkSpaceAndCamma = (word) => {
  if (word.includes(",") || word.includes("、")) return AND;
  if (word.includes(" ") || word.includes("　")) return OR;
  return ""
}

const createRegExp = (word, logic, condition) => {
  if (logic === OR) {
    return word.replaceAll("　", " ").split(" ").map(w => {
      return { [condition]: new RegExp(w) }
    })
  }
  if (logic === AND) {
    return word.replaceAll("、", ",").split(",").map(w => {
      return { [condition]: new RegExp(w) }
    });
  }
  return new RegExp(word)
}

const createJsonCategoryAndSupplier = (json) => {
  let cat_ary = [], sup_ary = [];
  json.forEach(j => {
    let cat = {}, sup = {};
    Object.keys(j).forEach(key => {
      if (key === "部門") {
        let val = kanaHanToZen(j["短縮"].split(" ")[0])
        cat["部門"] = j[key];
        cat["部門名"] = val;
      }
      if (key === "メーカーコード") {
        let val = j["メーカー名"] ? j["メーカー名"].trim() : j["メーカー名"];
        sup["メーカーコード"] = j[key];
        sup["メーカー名"] = val;
        sup["部門"] = j["部門"]
      }
    });
    cat_ary.push(cat);
    sup_ary.push(sup);
  });
  // 重複を削除
  cat_ary = makeUniqe(cat_ary, "部門");
  sup_ary = makeUniqe(sup_ary, "メーカーコード");

  return [cat_ary, sup_ary]
}

const makeUniqe = (objInAry, key) => {
  return objInAry.filter((item, index, array) => array.findIndex((item2) => item[key] === item2[key]) === index);
}
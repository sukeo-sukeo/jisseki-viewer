import { ipcMain } from "electron";
import { readXlsToJSON } from "./lib/readXlsFile.js";
import { createAnalysisFile } from "./lib/writeXlsFile.js";
import { checkTemplate, getTemplate } from "./lib/template.js";
import { updateMaster, checkUpdate, getData, getSubCondition } from "./lib/master.js";
// myApiリスト
// レンダラーからのイベントを受信しbackend.jsに伝える
ipcMain.handle("input-file-change", (e, path) => readXlsToJSON(path));
ipcMain.handle("analysis-btn-click", (e, path) => createAnalysisFile(path));
ipcMain.handle("analysis-vue-init", (e, fname) => checkTemplate(fname));
ipcMain.handle("master-input", (e, path) => updateMaster(path));
ipcMain.handle("get-template", (e) => getTemplate());
ipcMain.handle("header-vue-init", (e) => checkUpdate());
ipcMain.handle("master-search", (e, word, condition) => getData(word, condition));
ipcMain.handle("search-vue-init", (e) => getSubCondition());

export { ipcMain }
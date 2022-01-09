// import { ipcRenderer, contextBridge } from "electron";
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("myapi", {
  readXlsToJSON: async (path) => ipcRenderer.invoke("input-file-change", path),
  createAnalysisFile: async (path) =>
    ipcRenderer.invoke("analysis-btn-click", path),
  checkTemplate: async (filename) =>
    ipcRenderer.invoke("analysis-vue-init", filename),
  getTemplate: async () => ipcRenderer.invoke("get-template"),
  updateMaster: async (path) => ipcRenderer.invoke("master-input", path),
  checkMasterUpdated: async () => ipcRenderer.invoke("header-vue-init"),
  getData: async (word, condition) =>
    ipcRenderer.invoke("master-search", word, condition),
  getSubCondition: async (bumons, categories) =>
    ipcRenderer.invoke("search-vue-init"),
});

'use strict'
import { app, protocol, BrowserWindow } from 'electron';
import { ipcMain } from "./my_apiList.js";
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import path from "path";
import fs from "fs";
import Datastore from "nedb-promises";

// アプリで使うユーザーディレクトリ
const mainDirPath = app.getPath("userData");
const appPaths = {
  mainDirPath: mainDirPath,
  databaseDirPath: path.join(mainDirPath, "nedb"),
  templateDirPath: path.join(mainDirPath, "template"),
  outputDirPath: path.join(mainDirPath, "outputs"),
}

console.log(mainDirPath);

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

let win;
async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "..", "src","preload.js")
      // preload: `${__dirname}/../src/preload.js`,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

app.whenReady().then(() => {
  // templateDirが無ければ作成
  if (!fs.existsSync(appPaths.templateDirPath)) fs.mkdirSync(appPaths.templateDirPath);
  // outputDirが無ければ作成
  if (!fs.existsSync(appPaths.outputDirPath))
    fs.mkdirSync(appPaths.outputDirPath);

  const db = new Datastore({
    filename: path.join(appPaths.databaseDirPath, "jisseki_launchlog.db"),
    autoload: true,
  });
  // 起動ログとして保存
  db.insert({ time: new Date().getTime() });
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

export {appPaths, win}
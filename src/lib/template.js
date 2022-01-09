import { appPaths, win } from "../background.js"
import fs from "fs/promises";
import path from "path";
import { dialog } from "electron"

const TEMPLATE_F_NAME = "分析シート";

export const checkTemplate = async (file) => {
  console.log(file);
  const filenames = await fs.readdir(appPaths.templateDirPath) || [];
  console.log(filenames);
  
  if (filenames.filter((name) => name.includes(file)).length) {
    return true;
  } else {
    return false;
  }
};

export const getTemplate = async () => {
  const paths = dialog.showOpenDialogSync(win, {
    buttonLabel: "開く",
    properties: [
      "openFile",
      "createDirectory"
    ]
  });
  
  if (paths === undefined) {
    return { status: undefined };
  }

  const tPath = paths[0];
  if (!tPath.includes(TEMPLATE_F_NAME)) {
    return { status: undefined, msg: "ファイル名が違います。ファイル名「分析シート原本.xlsx」の場所を教えてください。" };
  } 
  const s_or_f = await copyTemplate(tPath);
  if (s_or_f) {
    return { status: tPath };
  } else {
    return { status: undefined, msg: "ファイルの取得に失敗しました。" };
  }
}

const copyTemplate = async (tPath) => {
  const filename = path.basename(tPath);
  try {
    await fs.copyFile(tPath, path.join(appPaths.templateDirPath, filename))
    return true
  } catch (e) {
    console.log(e.message);
    return false
  }
}
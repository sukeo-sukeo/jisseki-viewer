import Datastore from "nedb-promises";
import path from "path";
import { app } from "electron";
// appPathsは読み込み順の関係で使えない

// asmaster_db
export const db_master = new Datastore({
  filename: path.join(app.getPath("userData"), "nedb", "jisseki_asmaster.db"),
  autoload: true,
});

export const db_masterupdate = new Datastore({
  filename: path.join(app.getPath("userData"), "nedb", "jisseki_asmasterupdate.db"),
  autoload: true,
});

export const db_category = new Datastore({
  filename: path.join(app.getPath("userData"), "nedb", "jisseki_category.db"),
  autoload: true,
});

export const db_supplier = new Datastore({
  filename: path.join(app.getPath("userData"), "nedb", "jisseki_supplier.db"),
  autoload: true,
});


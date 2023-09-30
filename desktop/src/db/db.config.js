const sqlite3 = require("sqlite3").verbose();
const { app } = require("electron");
const fs = require("fs");
const userDatapath = app.getPath("documents");
const dir = userDatapath + "/Nomokit-jr";
const dirDb = dir + "/db";
const dirProject = dir + "/project";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
  fs.mkdirSync(dirDb);
  fs.mkdirSync(dirProject);
  fs.writeFileSync(dirDb + "/db.db", "");
}
const dbFile = dirDb + "/db.db";

const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
  if (err) throw err;
});

module.exports = db;

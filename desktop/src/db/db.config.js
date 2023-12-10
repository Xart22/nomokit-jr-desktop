const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname.replace("\\src\\db", "") + "/db");
const dirProject = dbPath + "/project";

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
  fs.mkdirSync(dirProject);
  fs.writeFileSync(dbPath + "/db.db", "");
}
const dbFile = dbPath + "/db.db";

const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
  if (err) throw err;
});

module.exports = db;

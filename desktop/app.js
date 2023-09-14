const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const getHwid = require("node-machine-id").machineIdSync;
const logger = require("electron-log");
const path = require("path");
const db = require("./src/db/db.config");

logger.transports.file.level = "info";
autoUpdater.logger = logger;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

// Menu Template

const _windows = {};

// Loading
const createLoading = () => {
  const query = `CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name VARCHAR(255),
    file_name VARCHAR(255) UNIQUE
  );`;
  db.run(query, (err, result) => {
    if (err) throw err;
    console.log("Table created");
  });

  const window = new BrowserWindow({
    width: 800,
    height: 800,
    frame: false,
    resizable: false,
    transparent: true,
    hasShadow: false,
    icon: path.join(__dirname, "/src/assets/images/icon.png"),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, "/src/pages/loading.html"));

  return window;
};

const createMainPage = () => {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    minHeight: 1400,
    minWidth: 900,
    icon: path.join(__dirname, "/src/assets/images/icon.png"),
    title: "Nomokit-Jr" + " - " + "v" + app.getVersion(),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "/src/pages/renderer.js"),
      webSecurity: false,
      enableRemoteModule: true,
    },
  });

  window.loadFile(path.join(__dirname, "/src/pages/home.html"));
  // window.webContents.openDevTools();

  return window;
};

app.whenReady().then(() => {
  _windows.loading = createLoading();
  setTimeout(function () {
    _windows.loading.close();
    delete _windows.loading;
    _windows.main = createMainPage();
  }, 3000);
});

let prjDataSelected = null;

ipcMain.on("getUrlPath", (e, msg) => {
  e.reply("reply-getUrlPath", _windows.main.webContents.getURL());
});

ipcMain.on("new-project", (e, msg) => {
  if (fs.existsSync(path.join(__dirname, "src/gui/chunks/gui.js"))) {
    fs.unlinkSync(path.join(__dirname, "src/gui/chunks/gui.js"));
  }
  const guiCp = fs.readFileSync(
    path.join(__dirname, "src/gui/chunks/gui-copy.js"),
    "utf8"
  );
  fs.writeFileSync(path.join(__dirname, "src/gui/chunks/gui.js"), guiCp);
  _windows.main.webContents.loadFile(
    path.join(__dirname, "/src/gui/index.html")
  );
});

ipcMain.on("load-project", async (e, msg) => {
  prjDataSelected = await getProjectDataById(msg);
  fs.unlinkSync(path.join(__dirname, "src/gui/chunks/gui.js"));
  try {
    const guiCp = fs.readFileSync(
      path.join(__dirname, "src/gui/chunks/gui-copy.js"),
      "utf8"
    );

    fs.writeFileSync(
      path.join(__dirname, "src/gui/chunks/gui.js"),
      guiCp.replace(
        "var prjPath = '';",
        `var prjPath = '../../storage/${prjDataSelected.file_name}.ob';`
      )
    );
    _windows.main.webContents.loadFile(
      path.join(__dirname, "/src/gui/index.html")
    );
  } catch (e) {
    console.log(e);
  }
});

ipcMain.on("get-status-project", (e, msg) => {
  e.reply("reply-get-status-project", prjDataSelected);
});

ipcMain.on("back-to-home", (e, msg) => {
  prjDataSelected = null;
  _windows.main.webContents.close();
  _windows.main = createMainPage();
});

async function getProjectDataById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM project WHERE id = ${id}`, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

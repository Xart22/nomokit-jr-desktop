const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const getHwid = require("node-machine-id").machineIdSync;
const logger = require("electron-log");
const path = require("path");
const db = require("./src/db/db.config");
const axios = require("axios");

logger.transports.file.level = "info";
autoUpdater.logger = logger;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

// Menu Template

const _windows = {};

// Loading
const createLoading = async () => {
  const queryCreateUserData = `CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255),
    user_name VARCHAR(255),
    password VARCHAR(255),
    token VARCHAR(255)
  );`;

  await new Promise((resolve, reject) => {
    db.run(queryCreateUserData, (err, result) => {
      if (err) throw err;
      resolve("Table created");
    });
  });

  const queryCreateTableProject = `CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name VARCHAR(255),
    file_name VARCHAR(255) UNIQUE
  );
  `;

  await new Promise((resolve, reject) => {
    db.run(queryCreateTableProject, (err, result) => {
      if (err) throw err;
      resolve("Table created");
    });
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

  //window.loadFile(path.join(__dirname, "/src/pages/home.html"));
  //window.webContents.openDevTools();

  return window;
};

app.whenReady().then(async () => {
  _windows.loading = await createLoading();
  const userData = await getUserData();
  setTimeout(async function () {
    _windows.loading.close();
    delete _windows.loading;
    _windows.main = createMainPage();

    if (userData == undefined || userData.token == 0) {
      _windows.main.webContents.loadFile(
        path.join(__dirname, "/src/pages/login.html")
      );
    } else {
      const userToken = await checkUserToken(userData.token);

      if (userToken.subscriptions != null) {
        if (userToken.subscriptions.is_active == 0) {
          await writeOrUpdateUserData("0", "0", "0", "0");
          _windows.main.webContents.loadFile(
            path.join(__dirname, "/src/pages/login.html")
          );
        } else {
          _windows.main.webContents.loadFile(
            path.join(__dirname, "/src/pages/home.html")
          );
        }
      } else if (userToken.trial != null) {
        if (userToken.trial.is_active == 0) {
          await writeOrUpdateUserData("0", "0", "0", "0");
          _windows.main.webContents.loadFile(
            path.join(__dirname, "/src/pages/login.html")
          );
        } else {
          _windows.main.webContents.loadFile(
            path.join(__dirname, "/src/pages/home.html")
          );
        }
      }
    }
  }, 3000);
});

app.on("ready", async () => {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-available", () => {
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "question",
        title: "Update available",
        message: "Update Version is available, will be installed on restart",
        buttons: ["Yes", "No"],
        yes: 0,
        no: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          app.exit();
          autoUpdater.quitAndInstall(false, false);
        }
      });
  });

  autoUpdater.on("error", (err) => {
    dialog.showErrorBox("Error: ", err == null ? "unknown" : err);
  });
});

let prjDataSelected = null;

ipcMain.on("login", async (event, arg) => {
  const hwid = getHwid();
  arg.hwid = hwid;
  arg.app = "nomokit-jr";
  await axios
    .post("https://nomo-kit.com/api/login", arg)
    .then(async (res) => {
      if (res.data.user.subscriptions == null) {
        if (res.data.user.trial != null) {
          res.data.user.subscriptions = res.data.user.trial;
        }
      }
      if (res.data.user.subscriptions == null) {
        event.reply("no-subscription", res.data);
        await axios.get("https://nomo-kit.com/api/logout", {
          headers: { Authorization: "Bearer " + res.data.token },
        });
      } else {
        if (res.data.user.subscriptions.is_active == 0) {
          event.reply("no-subscription", res.data);
          arg.status = "fail";
          await axios.get("https://nomo-kit.com/api/logout", {
            headers: { Authorization: "Bearer " + res.data.token },
          });
        } else {
          await writeOrUpdateUserData(
            res.data.user.email,
            res.data.user.name,
            arg.password,
            res.data.token
          );
          _windows.main.webContents.loadFile(
            path.join(__dirname, "/src/pages/home.html")
          );
        }
      }
    })
    .catch((err) => {
      console.log(err);
      event.reply("login-fail", err.response.data);
    });
});

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

async function writeOrUpdateUserData(email, username, password, token) {
  const userData = await getUserData();
  if (userData != undefined) {
    db.run(
      `UPDATE user SET email="${email}", user_name="${username}",password="${password}",token="${token}" WHERE id = 1`,
      (err) => {
        if (err) console.log(err);
      }
    );
  } else {
    db.run(
      `INSERT INTO user (email, user_name,password,token) VALUES (?,?,?,?)`,
      [email, username, password, token],
      (err) => {
        if (err) console.log(err);
      }
    );
  }
}

async function getUserData() {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM user WHERE id = 1`, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

async function checkUserToken(token) {
  return await axios
    .get("https://nomo-kit.com/api/user", {
      headers: { Authorization: "Bearer " + token },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      app.relaunch();
    });
}

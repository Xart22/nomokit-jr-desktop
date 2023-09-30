const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const db = require("../db/db.config");

window.addEventListener("DOMContentLoaded", async () => {
  const body = document.getElementsByTagName("body")[0];
  const audio = document.getElementById("mouseAudio");
  body.addEventListener("click", () => {
    play();
  });

  let projectData = await getProjectData();
  ipcRenderer.send("getUrlPath", true);
  ipcRenderer.on("reply-getUrlPath", (e, msg) => {
    let urlPath = "";
    urlPath = msg;
    if (urlPath.includes("login")) {
      const btn = document.getElementById("login");
      const error = document.getElementById("error");
      if (error !== null) {
        error.style.display = "none";
      }

      const email = document.getElementById("email");
      const password = document.getElementById("password");

      password.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          login();
        }
      });
      function login() {
        if (email.value !== "" && password.value !== "") {
          ipcRenderer.send("login", {
            email: email.value,
            password: password.value,
          });
        } else {
          email.classList.add("is-invalid");
          password.classList.add("is-invalid");
        }
      }

      if (error !== null) {
        btn.addEventListener("click", async () => {
          login();
        });
        email.addEventListener("keyup", (e) => {
          error.style.display = "none";
          email.classList.remove("is-invalid");
          password.classList.remove("is-invalid");
        });
        password.addEventListener("keyup", () => {
          error.style.display = "none";
          email.classList.remove("is-invalid");
          password.classList.remove("is-invalid");
        });
        ipcRenderer.on("login-fail", (event, arg) => {
          error.style.display = "block";
          email.classList.add("is-invalid");
          password.classList.add("is-invalid");
          error.innerHTML = "Email atau password salah";
        });
        ipcRenderer.on("no-subscription", (event, arg) => {
          error.style.display = "block";
          error.innerHTML = "Anda belum memiliki paket langganan";
        });
      }
    }

    if (urlPath.includes("home")) {
      const newPrjBtn = document.getElementById("newProjectBtn");

      newPrjBtn.addEventListener("click", () => {
        ipcRenderer.send("new-project", true);
      });

      const projectContainer = document.getElementById("projectContainer");
      projectData.forEach((item) => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "project-item";
        itemContainer.innerHTML = `<img src="../../storage/${item.file_name}.png" width="170" />
          ${item.project_name}`;
        itemContainer.onclick = function () {
          loadProject(item.id);
        };
        itemContainer.oncontextmenu = () => {
          if (confirm("Export this Project ?")) {
            const anchor = document.createElement("a");
            anchor.display = "none";
            anchor.download = item.file_name + ".ob";
            anchor.href = `../../storage/${item.file_name}.ob`;
            anchor.click();
            window.setTimeout(() => {
              document.body.removeChild(anchor);
            }, 1000);
          }
        };
        projectContainer.appendChild(itemContainer);
      });

      function loadProject(project_id) {
        ipcRenderer.send("load-project", project_id);
      }
    }

    if (urlPath.includes("gui")) {
      const loading = document.getElementById("loading");
      const homeBtn = document.getElementById("bacToHome");
      const saveBtn = document.getElementById("btnSaveProject");
      const img = document.getElementById("stageCanvas");
      let prjData = null;

      ipcRenderer.send("get-status-project", true);

      ipcRenderer.on("reply-get-status-project", (e, msg) => {
        if (msg) {
          const prjTitleInput = document.getElementById("prjTitle");
          prjTitleInput.value = msg.project_name;
          prjData = msg;
        }
      });

      homeBtn.addEventListener("click", () => {
        ipcRenderer.send("back-to-home", true);
      });

      saveBtn.addEventListener("click", () => {
        loading.style.display = "block";
        window.setTimeout(async () => {
          try {
            const projectLink = document.getElementById("linkDownloadProject");
            let projectName = document.getElementById("prjTitle").value;
            const fileName = projectName.toString() + "-" + Date.now();

            if (prjData) {
              db.run(
                `UPDATE project SET project_name="${projectName.toString()}", file_name="${fileName}" WHERE id = ?`,
                [prjData.id],
                (err) => {
                  if (err) console.log(err);
                }
              );
              fs.unlinkSync("storage/" + prjData.file_name + ".png");
              fs.unlinkSync("storage/" + prjData.file_name + ".ob");
            } else {
              db.run(
                `INSERT INTO project (project_name, file_name) VALUES (?,?)`,
                [projectName.toString(), fileName],
                (err) => {
                  if (err) console.log(err);
                }
              );
            }

            fs.writeFileSync(
              `storage/${fileName}.png`,
              img.toDataURL().split(",")[1],
              "base64"
            );
            await saveFile(projectLink.getAttribute("href"), fileName, "ob");
            alert("Save Project Succes");
            //ipcRenderer.send("back-to-home", true);
            loading.style.display = "none";
          } catch (error) {
            console.log(error);
          }
        }, 1000);
      });
    }
  });

  async function saveFile(url, fileName) {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.arrayBuffer();
        } else {
          console.error("Failed to fetch project: " + response.statusText);
        }
      })
      .then((arrayBuffer) => {
        if (arrayBuffer) {
          fs.writeFileSync(`storage/${fileName}.ob`, Buffer.from(arrayBuffer));
        }
      })
      .catch((e) => console.log(e));
  }

  async function getProjectData() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM project", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async function play() {
    audio.play();
    setTimeout(function () {
      audio.pause();
      audio.currentTime = 0;
    }, 300);
  }
});

const { ipcRenderer, shell, remote } = require("electron");
const fs = require("fs");
const path = require("path");
const db = require("../db/db.config");

window.addEventListener("DOMContentLoaded", async () => {
  let projectData = await getProjectData();
  ipcRenderer.send("getUrlPath", true);
  ipcRenderer.on("reply-getUrlPath", (e, msg) => {
    let urlPath = "";
    urlPath = msg;
    if (urlPath.includes("home")) {
      const newPrjBtn = document.getElementById("newProjectBtn");

      newPrjBtn.addEventListener("click", () => {
        ipcRenderer.send("new-project", true);
      });

      const projectContainer = document.getElementById("projectContainer");
      projectData.forEach((item) => {
        console.log(item);
        const itemContainer = document.createElement("div");
        itemContainer.className = "project-item";
        itemContainer.innerHTML = `<img src="../../storage/${item.file_name}.png" width="170" />
          ${item.project_name}`;
        console.log(itemContainer.innerHTML);
        itemContainer.onclick = function () {
          loadProject(item.id);
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
          console.log(msg);
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
});

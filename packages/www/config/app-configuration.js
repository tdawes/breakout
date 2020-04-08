const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const firebase = path.join(root, "node_modules", ".bin", "firebase");

module.exports = function () {
  const projectId = childProcess
    .execFileSync(firebase, ["use"], { encoding: "utf8" })
    .trim();
  if (!projectId) {
    throw new Error("You must select a Firebase project with `firebase use`.");
  }
  const configuration = fs.readFileSync(
    path.join(root, "config", "projects", projectId, "ui.json"),
    "utf-8",
  );
  process.env.REACT_APP_CONFIG = configuration;
  return JSON.parse(configuration);
};

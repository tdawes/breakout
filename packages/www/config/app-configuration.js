/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint no-undef: 0 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

module.exports = function () {
  const configuration = fs.readFileSync(
    path.join(
      root,
      "config",
      "projects",
      process.env.GOOGLE_CLOUD_PROJECT,
      "ui.json",
    ),
    "utf-8",
  );
  return JSON.parse(configuration);
};

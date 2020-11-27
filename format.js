const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");

process.chdir(path.join(".", "assets"));
fs.readdirSync(".")
  .filter((dir) => fs.statSync(dir).isDirectory())
  .forEach((dir) => {
    const fileAsset = path.join(dir, "asset.json"); // HARD-CODED
    const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
    const asset = JSON.parse(jsonAsset);

    fs.writeFileSync(fileAsset, stringify(asset, { space: "  " }) + "\n");
  });

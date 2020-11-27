const fs = require("fs");
const encoding = require("@cosmjs/encoding");
const path = require("path");
const stringify = require("json-stable-stringify");

("use strict");

const jsonFileWritter = (file, assets) => {
  fs.writeFileSync(
    file,
    stringify(
      assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
      { space: "  " },
    ) + "\n",
  );
};
const javascriptFileWritter = (file, assets) => {
  fs.writeFileSync(
    file,
    "export default " +
      stringify(
        assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
        { space: "  " },
      ) +
      "\n",
  );
};

// asset directories
const dirs = fs
  .readdirSync("assets")
  .filter((dir) => fs.statSync(path.join("assets", dir)).isDirectory());

// ./assets.json
const assets = dirs.map((dir) => {
  const fileAsset = path.join("assets", dir, "asset.json"); // HARD-CODED
  const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
  const asset = JSON.parse(jsonAsset);

  // drop starname properties
  delete asset.logo;
  delete asset.name;

  return asset;
});

javascriptFileWritter("assets.js", assets); // HARD-CODED
jsonFileWritter("assets.json", assets); // HARD-CODED

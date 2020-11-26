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

// ./starname/assets.json
const starnameAssets = dirs.map((dir) => {
  const fileAsset = path.join("assets", dir, "asset.json"); // HARD-CODED
  const fileMetadata = path.join("assets", dir, "metadata", "info.json"); // HARD-CODED
  const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
  const jsonMetadata = fs.readFileSync(fileMetadata, "utf-8");
  const asset = JSON.parse(jsonAsset);
  const metadata = JSON.parse(jsonMetadata);

  Object.keys(metadata).forEach((key) => (asset[key] = metadata[key]));

  // drop trustwallet properties
  delete asset["trustwallet-info"];
  delete asset["trustwallet-uid"];

  // possibly inject name
  if (!asset.name) {
    const fileInfo = path.join(".", ...metadata["trustwallet-info"].split("/"));
    const jsonInfo = fs.readFileSync(fileInfo);
    const info = JSON.parse(jsonInfo);

    if (!info.name) {
      error = true;
      console.error(`${fileInfo} is missing property 'name'!`);
    }

    asset.name = info.name;
  }

  // replace logo with base64
  const fileLogo =
    asset.logo ||
    path.join(
      ".",
      metadata["trustwallet-info"].replace("info.json", "logo.png"),
    ); // HARD-CODED
  const binary = fs.readFileSync(fileLogo);
  const logo = encoding.toBase64(binary);

  asset.logo = `data:image/png;base64,${logo}`;

  return asset;
});

javascriptFileWritter(path.join("starname", "assets.js"), starnameAssets); // HARD-CODED
jsonFileWritter(path.join("starname", "assets.json"), starnameAssets); // HARD-CODED

const fs = require("fs");
const path = require("path");

let error = false;

const assets = {};
const propsAsset = ["caip-19", "symbol", "trustwallet-uid"];

fs.readdirSync("assets")
  .filter((dir) => fs.statSync(path.join("assets", dir)).isDirectory())
  .forEach((dir) => {
    const fileAsset = path.join("assets", dir, "asset.json"); // HARD-CODED
    const jsonAsset = fs.readFileSync(fileAsset, "utf-8");

    try {
      const asset = JSON.parse(jsonAsset);

      // check properties
      propsAsset.forEach((prop) => {
        if (!asset.hasOwnProperty(prop)) {
          error = true;
          console.error(`${fileAsset} is missing property '${prop}'.`);
        }
      });

      // check symbol
      const symbol = asset.symbol.toLowerCase();

      if (symbol != dir) {
        error = true;
        console.error(`Invalid directory or symbol for ${fileAsset}.`);
      }

      if (assets[symbol]) {
        error = true;
        console.error(`Duplicate symbol '${asset.symbol}' in ${fileAsset}'.`);
      }

      // add to assets
      assets[symbol] = true;
    } catch (e) {
      console.error(fileAsset, e.message);
    }
  });

process.exit(error ? -1 : 0);

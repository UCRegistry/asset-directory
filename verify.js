const fs = require("fs");
const path = require("path");

let error = false;

const assets = {};
const propsAsset = ["caip-19", "symbol", "trustwallet-uid"];
const propsMetadata = ["starname-uri", "trustwallet-info"];

fs.readdirSync("assets")
  .filter((dir) => fs.statSync(path.join("assets", dir)).isDirectory())
  .forEach((dir) => {
    const fileAsset = path.join("assets", dir, "asset.json"); // HARD-CODED
    const fileMetadata = path.join("assets", dir, "metadata", "info.json"); // HARD-CODED
    const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
    const jsonMetadata = fs.readFileSync(fileMetadata, "utf-8");

    try {
      const asset = JSON.parse(jsonAsset);
      const metadata = JSON.parse(jsonMetadata);

      // check properties
      propsAsset.forEach((prop) => {
        if (!asset.hasOwnProperty(prop)) {
          error = true;
          console.error(`${fileAsset} is missing property '${prop}'.`);
        }
      });
      propsMetadata.forEach((prop) => {
        if (!metadata.hasOwnProperty(prop)) {
          error = true;
          console.error(`${fileMetadata} is missing property '${prop}'.`);
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

      // check congruency
      if (metadata["starname-uri"] != `asset:${symbol}`) {
        error = true;
        console.error(
          `Invalid uri of '${metadata["starname-uri"]}' in ${fileMetadata}; should be 'asset:${symbol}'.`,
        );
      }

      // check trustwallet info
      const fileInfo = metadata["trustwallet-info"]
        ? path.join(".", ...metadata["trustwallet-info"].split("/"))
        : null;

      if (fileInfo && !fs.existsSync(fileInfo)) {
        error = true;
        console.error(`Invalid path '${fileInfo}' in ${fileMetadata}.`);
      }

      // check name
      if (!asset.name && fileInfo) {
        const jsonInfo = fs.readFileSync(fileInfo);
        const info = JSON.parse(jsonInfo);

        if (!info.name) {
          error = true;
          console.error(`${fileInfo} is missing property 'name'!`);
        }
      }

      // check logo
      const fileLogo = metadata["trustwallet-info"]
        ? path.join(
            ".",
            ...metadata["trustwallet-info"]
              .replace("info.json", "logo.png")
              .split("/"),
          )
        : path.join( "assets", symbol, "metadata", "logo.png" );

      if (
        !asset.logo &&
        ((fileLogo && !fs.existsSync(fileLogo)) || !fileLogo)
      ) {
        error = true;
        console.error(`Missing logo for symbol '${symbol}!'`);
      }

      // add to assets
      assets[symbol] = true;
    } catch (e) {
      console.error(fileAsset, fileMetadata, e.message);
    }
  });

process.exit(error ? -1 : 0);

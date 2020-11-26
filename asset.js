const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");

const prompt = async (display) => {
  return new Promise((resolve) => {
    process.stdout.write(display);
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      resolve(String(data).trim());
    });
  });
};

const main = async () => {
  const reSymbol = new RegExp(/[A-Z]/);
  const fetched = await fetch(
    "https://raw.githubusercontent.com/trustwallet/wallet-core/master/coins.json",
  ).catch((e) => {
    throw e;
  });
  const coins = await fetched.json().catch((e) => {
    throw e;
  });

  while (true) {
    const symbol = await prompt(
      `Enter the symbol of the token or Ctrl-c to quit: `,
    ).catch((e) => {
      throw e;
    });

    if (!symbol.match(reSymbol))
      throw new Error(`Symbol should be mostly upper case, not '${symbol}'.`);
    if (fs.existsSync(path.join("assets", symbol)))
      throw new Error(`Asset for symbol ${symbol} already exists.`);

    const lowercased = symbol.toLowerCase();
    const coin = coins.find((coin) => coin.symbol == symbol);
    const fileTrust = coin
      ? path.join(
          "trustwallet",
          "assets",
          "blockchains",
          coin.id,
          "info",
          "info.json",
        )
      : null; // HARD-CODED
    const trusted = fs.existsSync(fileTrust)
      ? JSON.parse(fs.readFileSync(fileTrust, "utf-8"))
      : null;
    const name =
      (trusted && trusted.name) ||
      (await prompt(`Enter the name of the token: `).catch((e) => {
        throw e;
      }));
    const fileAsset = path.join("assets", lowercased, "asset.json"); // HARD-CODED
    const fileMetadata = path.join(
      "assets",
      lowercased,
      "metadata",
      "info.json",
    ); // HARD-CODED
    const asset = {
      "caip-19": null,
      symbol: symbol,
      "trustwallet-uid": coin ? `c${coin.coinId}` : null,
    };
    const metadata = {
      "starname-uri": `asset:${lowercased}`,
      "trustwallet-info": trusted ? `/${fileTrust}` : null,
    };

    if (!trusted) {
      asset.logo = fileMetadata.replace("info.json", "logo.png"); // HARD-CODED
      asset.name = name;
    }

    fs.mkdirSync(path.join("assets", lowercased, "metadata"), {
      recursive: true,
    });
    fs.writeFileSync(fileAsset, stringify(asset, { space: "  " }) + "\n");
    fs.writeFileSync(fileMetadata, stringify(metadata, { space: "  " }) + "\n");
    console.log(`Wrote ${fileAsset} and ${fileMetadata}.`);
  }
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.stack || e.message || e);
    process.exit(-1);
  });

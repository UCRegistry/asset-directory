const fetch = require("node-fetch");

("use strict");

const main = async () => {
  const fetched = await fetch(
    "https://raw.githubusercontent.com/trustwallet/wallet-core/master/coins.json",
  ).catch((e) => {
    throw e;
  });
  const trust = await fetched.json().catch((e) => {
    throw e;
  });
  const coins = {};

  trust.forEach((coin) => {
    const symbol = coin.symbol;
    const seen = coins.hasOwnProperty(symbol);

    if (!seen) coins[symbol] = [];

    coins[symbol].push(coin.coinId);
  });

  Object.keys(coins).forEach(
    (symbol) =>
      coins[symbol].length > 1 &&
      console.warn(`${symbol} has ids ${coins[symbol].join(", ")}.`),
  );
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.stack || e.message || e);
    process.exit(-1);
  });

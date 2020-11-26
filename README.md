# Digital Assets Directory #

The Digital Assets Directory references all crypto-assets by giving a unique ticker for each crypto-asset. Each asset definition is based on the CAIP-19 specification (https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-19.md). This registry aims to become the reference when it comes to give a ticker for a crypto-asset.

# Why are doing this directory? #

Each Wallet or Exchange maintains currently its own registry and gives for each asset a different asset denomination. This is a problem when we want to achieve for example a mobile deep link standard to transfer an asset. For example today to send a bitcoin with mobile link on Trust Wallet, Bitcoin is reference as 0 (Slip44 index) but it is reference as BTC for the Wallet Paytomat. Becasue each wallets reference with a different denomatation each asset, it is very difficult to build a mobile deep link standard. The Digital Asset Directory aims to solve this issue.

# To add an asset #

To add an asset to the directory simply fork this repo and do

```sh
export MY_FORK=github_id # replace 'github_id' with your github id
git clone --recurse-submodules https://github.com/${MY_FORK}/asset-directory.git \
  && cd asset-directory \
  && yarn install \
  && yarn add-asset \
  && yarn aggregate
```

and follow the prompt(s).  Commit your changes, push, and then submit a PR.

# Scripts #

- [asset.js](asset.js) - adds an asset to the directory
- [format.js](format.js) - formats all assets' json consistently, ie alphabetically sorts keys; called by the `git pre-commit` hook
- [verify.js](verify.js) - verifies that all required properties are provided for each asset in the directory; called by the `git pre-commit` and `git pre-push` hooks
- [aggregate.js](aggregate.js) - combines indivdual asset data into assets.json
- [unique.js](unique.js) - reports trustwallet assets that have a collision on their symbols

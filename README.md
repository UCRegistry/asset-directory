# **Asset ID Directory**

The Asset ID Directory gives a unique ticker for each digital asset (for example, `BTC` for Bitcoin). We define each digital asset by following the CAIP-19 specification ([https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-19.md](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-19.md)).

# Motivation

Providing a unique human readable identifier for each digital asset across the all crypto-ecosystem enables new services like:

- standard mobile deep link to send a digital asset on any wallets and exchanges
- being able to reuse collaborative databases of digital assets' metadata because each wallet/exchange/provider agree on the same Asset ID

The only current identifier to reference an asset is currently Slip44. However Slip44 only references native tokens. The goal of the Asset ID directory is to give a unique identifier for each digital asset. Then any provider can build their own  or collaborative database based on these identifiers.

Regarding mobile deep linking, each wallet or exchange currently maintains its own registry and gives each asset a different asset designation. This is a problem when we want to achieve a mobile deep link standard to transfer an asset. For example, today to send a Bitcoin with a mobile link on Trust Wallet, Bitcoin is referenced as `0` (Slip44 index) but it is referenced as `BTC` for the Wallet Paytomat. Because each wallet references each asset with a different designation, it is very difficult to build a mobile deep link standard. The Asset ID Directory aims to solve this issue, by making this initiative neutral and collaborative, we also aim for a massive adoption around the ecosystem.

# CASA Working groups

[Join CASA here](https://github.com/ChainAgnostic/CASA)

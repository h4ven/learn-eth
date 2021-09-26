# ethers examples

Examples of using `ether.js` library to interact with ethereum mainnet.

## Setup

Setup node project,

```bat
$ mkdir ethers-examples
$ cd ethers-examples
$ npm init -y
$ npm install --save-dev ethers
```

Download Uniswap ABIs,

```bat
$ mkdir abis
$ cd abis
$ curl https://unpkg.com/@uniswap/v2-core@1.0.1/build/IUniswapV2Pair.json -o IUniswapV2Pair.json
$ curl https://unpkg.com/@uniswap/v2-core@1.0.1/build/IUniswapV2Factory.json -o IUniswapV2Factory.json
```

Solidity interfaces for these contracts are present here: https://github.com/Uniswap/v2-core/tree/master/contracts/interfaces

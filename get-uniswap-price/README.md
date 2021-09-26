# get-uniswap-price

Trying to get the token pair price from Uniswap.

## Steps

Create new nodejs project.

```bat
$ mkdir get-uniswap-price
$ cd get-uniswap-price
$ npm init -y
```

Install Uniswap SDK and ether.js libraries.

```bat
$ npm install --save-dev @uniswap/sdk
$ npm install --save-dev ethers
```

`--save-dev` adds the package as a dev dependency in the `package.json` file.

## Run example

First we need to set the Alchemy API key or run a local ethereum node.

```bat
$ set ALCHEMY_API_KEY=...
```

Run with `node`,

```bat
$ node get_token.js
DAI:  0x6B175474E89094C44Da98b954EedeAC495271d0F
WETH:  0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
DAI price:  0.000332498 , WETH price:  3007.54
```

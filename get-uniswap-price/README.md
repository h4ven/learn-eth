# get-uniswap-price

Trying to get the token pair price from Uniswap.

## Steps

Create new nodejs project.

```bash
$ mkdir get-uniswap-price
$ cd get-uniswap-price
$ npm init -y
```

Install Uniswap SDK and ether.js libraries.

```bash
$ npm install --save-dev @uniswap/sdk
$ npm install --save-dev ethers
```

`--save-dev` adds the package as a dev dependency in the `package.json` file.

const { ethers } = require("ethers");
const {ChainId, Token, WETH, Fetcher} = require("@uniswap/sdk");

const apiKey = process.env.ALCHEMY_API_KEY;
if (apiKey === undefined) {
    console.log("export ALCHEMY_API_KEY=...");
    process.exit(1);
}

// default JSON RPC provider is http://localhost:8545
// we can setup a local etherem node using `ganache` or `geth` or `hardhat`
const localProvider = new ethers.providers.JsonRpcProvider();

// use a remote provider like Alchemy or Infura
const remoteProvider = new ethers.providers.AlchemyProvider("homestead", apiKey);

// retrieve token
// we can get `tokenAddress` and `decimals` for a coin from etherscan
// e.g., for DAI => https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f
const chainId = ChainId.MAINNET;
const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const decimals = 18;

const DAI = new Token(chainId, tokenAddress, decimals);
console.log("DAI: ", DAI.address);

// we can also fetch a token using the `Fetcher` API
// https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
async function getToken(chainId, tokenAddress) {
    const WETH = await Fetcher.fetchTokenData(chainId, tokenAddress, remoteProvider);
    return WETH;
}

const local_WETH = getToken(ChainId.MAINNET, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
local_WETH.then(token => console.log("WETH: ", token.address));

// WETH is also exported by the Uniswap SDK so we will use that instead

// get Uniswap pairs
async function getPair(token1, token2) {
    const pair = await Fetcher.fetchPairData(token1, token2, remoteProvider);
    return pair;
}

const pair = getPair(DAI, WETH[DAI.chainId]);
pair.then(pair => console.log("DAI price: ", pair.token0Price.toSignificant(6), ", WETH price: ", pair.token1Price.toSignificant(6)));

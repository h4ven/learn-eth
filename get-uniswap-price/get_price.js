const { ethers } = require("ethers");
const { ChainId, Token, WETH, Fetcher, Route } = require("@uniswap/sdk");

const apiKey = process.env.ALCHEMY_API_KEY;
if (apiKey === undefined) {
    console.log("export ALCHEMY_API_KEY=...");
    process.exit(1);
}

const remoteProvider = new ethers.providers.AlchemyProvider("homestead", apiKey);

async function getToken(chainId, tokenAddress) {
    const token = await Fetcher.fetchTokenData(chainId, tokenAddress, remoteProvider);
    return token;
}

async function getPair(token1, token2) {
    const pair = await Fetcher.fetchPairData(token1, token2);
    return pair;
}

async function midPrice() {
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const DAI = await getToken(ChainId.MAINNET, daiAddress);
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);

    // a `route` is necessary so that we are explicity about the direction of the swap
    // we want to use, in this case DAI/WETH (amount of DAI for 1 WETH)
    const route = new Route([pair], WETH[DAI.chainId]);

    // mid price reflects the ratio of reserves in one or more pairs
    // relative value of one token in terms of the other
    console.log("(WETH -> DAI) mid price: ", route.midPrice.toSignificant(6));
    console.log("(DAI -> WETH) mid price: ", route.midPrice.invert().toSignificant(6));
}

async function indirectMidPrice() {
    // useful when we want to trade pairs which don't exist
    // e.g., assuming DAI/WETH doesn't exist, we could then do:
    // USDC/WETH + DAI/USDC
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const DAI = await getToken(ChainId.MAINNET, daiAddress);

    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const USDC = await getToken(ChainId.MAINNET, usdcAddress);

    const usdcWethPair = await Fetcher.fetchPairData(USDC, WETH[USDC.chainId]);
    const daiUsdcPair = await Fetcher.fetchPairData(DAI, USDC);

    const route = new Route([usdcWethPair, daiUsdcPair], WETH[ChainId.MAINNET]);

    console.log("(WETH -> USDC -> DAI) mid price: ", route.midPrice.toSignificant(6));
    console.log("(DAI -> USDC -> WETH) mid price: ", route.midPrice.invert().toSignificant(6));
}

async function main() {
    await midPrice();
    await indirectMidPrice();
}

main()

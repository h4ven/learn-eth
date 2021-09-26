const { ethers } = require("ethers");
const {
    ChainId,
    Token,
    WETH,
    Fetcher,
    Trade,
    Route,
    TokenAmount,
    TradeType
} = require("@uniswap/sdk");

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

async function main() {
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const DAI = await getToken(ChainId.MAINNET, daiAddress);

    const pair = await getPair(DAI, WETH[DAI.chainId]);

    const route = new Route([pair], WETH[DAI.chainId]);

    const trade = new Trade(
        route,
        new TokenAmount(WETH[DAI.chainId], "1000000000000000000"),
        TradeType.EXACT_INPUT
    );

    console.log("DAI/WETH execution price: ", trade.executionPrice.toSignificant(6));
    console.log("DAI/WETH post trade mid price: ", trade.nextMidPrice.toSignificant(6));
}

main();

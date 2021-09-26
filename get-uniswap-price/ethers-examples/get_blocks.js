const { ethers } = require("ethers");

const UniswapV2Pair = require("./abis/IUniswapV2Pair.json");
const UniswapV2Factory = require("./abis/IUniswapV2Factory.json");

const apiKey = process.env.ALCHEMY_API_KEY;
if (apiKey === undefined) {
    console.log("export ALCHEMY_API_KEY=...");
    process.exit(1);
}

const provider = new ethers.providers.AlchemyProvider('homestead', apiKey);
const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

async function getPairs() {
    // ShushiSwap: SushiV2Factory
    // https://etherscan.io/address/0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac
    const sushiFactory = new ethers.Contract(
        "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
        UniswapV2Factory.abi,
        provider
    );

    // Uniswap V2: Factory Contract
    // https://etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
    const uniswapFactory = new ethers.Contract(
        "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        UniswapV2Factory.abi,
        provider
    );

    const sushiEthDai = new ethers.Contract(
        await sushiFactory.getPair(wethAddress, daiAddress),
        UniswapV2Pair.abi,
        provider
    );

    const uniswapEthDai = new ethers.Contract(
        await uniswapFactory.getPair(wethAddress, daiAddress),
        UniswapV2Pair.abi,
        provider
    );

    return [sushiEthDai, uniswapEthDai];
}

async function main() {
    const [sushiEthDai, uniswapEthDai] = await getPairs();

    provider.on("block", async(blockNumber) => {
        try {
            console.log("block number: ", blockNumber);

            const sushiReserves = await sushiEthDai.getReserves();
            const uniswapReserves = await uniswapEthDai.getReserves();

            const sushiReserve0 = Number(ethers.utils.formatUnits(sushiReserves[0], 18));
            const sushiReserve1 = Number(ethers.utils.formatUnits(sushiReserves[1], 18));

            const uniswapReserve0 = Number(ethers.utils.formatUnits(uniswapReserves[0], 18));
            const uniswapReserve1 = Number(ethers.utils.formatUnits(uniswapReserves[1], 18));

            const priceSushiswap = sushiReserve0 / sushiReserve1;
            const priceUniswap = uniswapReserve0 / uniswapReserve1;

            const spread = Math.abs((priceSushiswap / priceUniswap - 1) * 100) - 0.6;

            console.log("uniswap price   : ", priceUniswap);
            console.log("sushiswap price : ", priceSushiswap);
            console.log("spread          : ", (priceSushiswap / priceUniswap - 1) * 100, " %");
            console.log("absolute spread :", spread);
        }
        catch (err) {
            console.log("error: ", error);
        }
    });
}

main();

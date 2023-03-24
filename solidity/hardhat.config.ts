import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";

const ALCHEMY_API_KEY = 'Q1VjahmEI8-uW5zwHCn48yIqKGBELNmi'

//Don't steal my wallet
const SEPOLIA_PRIVATE_KEY = 'a54ff2770d0d717b599ba93e65c00393df3a600a3494e91ae2920efae53ea3d3'

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY ]
    }
  }
};

export default config;
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_RPC_URL_FOR_POLYGON_MAINNET =
  process.env.QUICKNODE_RPC_URL_FOR_POLYGON_MAINNET;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: QUICKNODE_RPC_URL_FOR_POLYGON_MAINNET,
      },
    },
  },
};

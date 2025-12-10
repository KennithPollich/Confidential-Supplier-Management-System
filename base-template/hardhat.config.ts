import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    zama: {
      url: process.env.ZAMA_RPC_URL || "https://devnet.zama.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  fhevm: {
    networkConfig: {
      sepolia: {
        chainId: 11155111,
        rpcUrl: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
        aclAddress: "0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92",
        tfheExecutorAddress: "0x05fD9B5EFE0a996095f42Ed7e77c390810CF660c",
      },
      zama: {
        chainId: 8009,
        rpcUrl: process.env.ZAMA_RPC_URL || "https://devnet.zama.ai",
        aclAddress: "0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92",
        tfheExecutorAddress: "0x05fD9B5EFE0a996095f42Ed7e77c390810CF660c",
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 60000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
  },
};

export default config;

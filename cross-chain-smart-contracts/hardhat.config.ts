import 'dotenv/config';
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'solidity-coverage';
import 'hardhat-deploy-tenderly';
import '@openzeppelin/hardhat-upgrades';
import { HardhatUserConfig } from 'hardhat/types';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
            details: {
              yul: true,
            },
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    simpleERC20Beneficiary: 1,
  },
  networks: {
    hardhat: {
      chainId: 1,
      initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
      forking: {
        enabled: true,
        url: process.env.ETH_NODE_URI_MAINNET,
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    mainnet: {
      url: process.env.ETH_NODE_URI_MAINNET,
      accounts: [process.env.PK_MAINNET],
    },
    goerli: {
      url: process.env.ETH_NODE_URI_GOERLI,
      accounts: [process.env.PK_GOERLI],
    },
    polygon: {
      url: process.env.ETH_NODE_URI_POLYGON,
      accounts: [process.env.PK_POLYGON],
    },
    bsc: {
      url: process.env.ETH_NODE_URI_BSC,
      accounts: [process.env.PK_BSC],
    },
    tenderly: {
      url: process.env.ETH_NODE_URI_TENDERLY,
      accounts: [process.env.PK_TENDERLY],
    },
    arbitrumOne: {
      url: process.env.ETH_NODE_URI_ARBITRUM,
      accounts: [process.env.PK_ARBITRUM],
    },
    avalanche: {
      url: process.env.ETH_NODE_URI_AVALANCHE,
      accounts: [process.env.PK_AVALANCHE],
    },
    optimisticEthereum: {
      url: process.env.ETH_NODE_URI_OPTIMISM,
      accounts: [process.env.PK_OPTIMISM],
    },
    opera: {
      url: process.env.ETH_NODE_URI_FANTOM,
      accounts: [process.env.PK_FANTOM],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      optimisticEthereum: process.env.OPTIMISMSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      arbitrumOne: process.env.ARBITRUMSCAN_API_KEY,
      avalanche: process.env.SNOWTRACE_API_KEY,
      opera: process.env.FTMSCAN_API_KEY,
    },
  },
  paths: {
    sources: 'src',
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
  },
  tenderly: {
    project: 'template-ethereum-contracts',
    username: process.env.TENDERLY_USERNAME,
  },
};

export default config;

declare namespace NodeJS {
  export interface ProcessEnv {
    ETH_NODE_URI_MAINNET: string;
    PK_MAINNET: string;
    ETHERSCAN_API_KEY: string;

    ETH_NODE_URI_GOERLI: string;
    PK_GOERLI: string;

    ETH_NODE_URI_OPTIMISM: string;
    PK_OPTIMISM: string;
    OPTIMISMSCAN_API_KEY: string;

    ETH_NODE_URI_BSC: string;
    PK_BSC: string;
    BSCSCAN_API_KEY: string;

    ETH_NODE_URI_POLYGON: string;
    PK_POLYGON: string;
    POLYGONSCAN_API_KEY: string;

    ETH_NODE_URI_ARBITRUM: string;
    PK_ARBITRUM: string;
    ARBITRUMSCAN_API_KEY: string;

    ETH_NODE_URI_AVALANCHE: string;
    PK_AVALANCHE: string;
    SNOWTRACE_API_KEY: string;

    ETH_NODE_URI_FANTOM: string;
    PK_FANTOM: string;
    FTMSCAN_API_KEY: string;

    ETH_NODE_URI_TENDERLY: string;
    PK_TENDERLY: string;

    REPORT_GAS?: string;
    COINMARKETCAP_API_KEY: string;

    TENDERLY_USERNAME: string;
  }
}

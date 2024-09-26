import {
  ChainData,
  ConnectorTokens,
  SmartContractAbis,
  SmartContractsAddresses,
  Token,
} from "./types";
import CrossChainRouterAbi from "./abi/CrossChainRouter.json";
import CrossChainWalletAbi from "./abi/CrossChainWallet.json";

export enum Chain {
  MAINNET = 1,
  OPTIMISM = 10,
  BSC = 56,
  POLYGON = 137,
  FANTOM = 250,
  ARBITRUM = 42161,
  AVALANCHE = 43114,
}

export const nativeToken: Record<Chain, Token> = {
  [Chain.MAINNET]: {
    chainId: Chain.MAINNET,
    name: "ETH",
    symbol: "ETH",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
  [Chain.OPTIMISM]: {
    chainId: Chain.OPTIMISM,
    name: "ETH",
    symbol: "ETH",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
  [Chain.BSC]: {
    chainId: Chain.BSC,
    name: "BNB",
    symbol: "BNB",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
  [Chain.POLYGON]: {
    chainId: Chain.POLYGON,
    name: "MATIC",
    symbol: "MATIC",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
  [Chain.FANTOM]: {
    chainId: Chain.FANTOM,
    name: "FTM",
    symbol: "FTM",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
  [Chain.ARBITRUM]: {
    chainId: Chain.ARBITRUM,
    name: "ETH",
    symbol: "ETH",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
  [Chain.AVALANCHE]: {
    chainId: Chain.AVALANCHE,
    name: "AVAX",
    symbol: "AVAX",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
  },
};

export const usdtToken: Record<Chain.BSC, Token> = {
  [Chain.BSC]: {
    chainId: Chain.BSC,
    name: "Binance-Peg BSC-USD",
    symbol: "USDT",
    address: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
  },
};

export const usdcToken: Record<Chain, Token> = {
  [Chain.MAINNET]: {
    chainId: Chain.MAINNET,
    name: "USDC",
    symbol: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
  },
  [Chain.OPTIMISM]: {
    chainId: Chain.OPTIMISM,
    name: "USDC",
    symbol: "USDC",
    address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    decimals: 6,
  },
  [Chain.BSC]: {
    chainId: Chain.BSC,
    name: "USDC",
    symbol: "USDC",
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    decimals: 18,
  },
  [Chain.POLYGON]: {
    chainId: Chain.POLYGON,
    name: "USDC",
    symbol: "USDC",
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    decimals: 6,
  },
  [Chain.FANTOM]: {
    chainId: Chain.FANTOM,
    name: "USDC",
    symbol: "USDC",
    address: "0x28a92dde19d9989f39a49905d7c9c2fac7799bdf", //stargate USDC
    decimals: 6,
  },
  [Chain.ARBITRUM]: {
    chainId: Chain.ARBITRUM,
    name: "USDC",
    symbol: "USDC",
    address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    decimals: 6,
  },
  [Chain.AVALANCHE]: {
    chainId: Chain.AVALANCHE,
    name: "USDC",
    symbol: "USDC",
    address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    decimals: 6,
  },
};

export const connectorTokens: Record<Chain, ConnectorTokens> = {
  [Chain.MAINNET]: {
    [usdcToken[Chain.MAINNET].address]: usdcToken[Chain.MAINNET],
  },
  [Chain.OPTIMISM]: {
    [usdcToken[Chain.OPTIMISM].address]: usdcToken[Chain.OPTIMISM],
  },
  [Chain.BSC]: {
    [usdcToken[Chain.BSC].address]: usdcToken[Chain.BSC],
    [usdtToken[Chain.BSC].address]: usdtToken[Chain.BSC],
  },
  [Chain.POLYGON]: {
    [usdcToken[Chain.POLYGON].address]: usdcToken[Chain.POLYGON],
  },
  [Chain.FANTOM]: {
    [usdcToken[Chain.FANTOM].address]: usdcToken[Chain.FANTOM],
  },
  [Chain.ARBITRUM]: {
    [usdcToken[Chain.ARBITRUM].address]: usdcToken[Chain.ARBITRUM],
  },
  [Chain.AVALANCHE]: {
    [usdcToken[Chain.AVALANCHE].address]: usdcToken[Chain.AVALANCHE],
  },
};

export const BlocksConfirmation: Record<Chain, number> = {
  [Chain.MAINNET]: 6,
  [Chain.OPTIMISM]: 14, //https://help.coinbase.com/en/coinbase/getting-started/crypto-education/optimism
  [Chain.BSC]: 6,
  [Chain.POLYGON]: 55,
  [Chain.FANTOM]: 1,
  [Chain.ARBITRUM]: 6, // not sure, can't find number of confirmations
  [Chain.AVALANCHE]: 1,
};

export const SmartContracts: Record<Chain, SmartContractsAddresses> = {
  [Chain.MAINNET]: {
    crossChainWallet: "0xb4fDA86d41885ecE3672fD512446D75772EDb755",
    crossChainRouter: "0xdb91581407aec82d62cddae7c3fea82162fe26ab",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0x6b7a87899490ece95443e979ca9485cbe7e71522",
    stargateRouter: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
  },
  [Chain.OPTIMISM]: {
    crossChainWallet: "0xb4fDA86d41885ecE3672fD512446D75772EDb755",
    crossChainRouter: "0xdb91581407aec82d62cddae7c3fea82162fe26ab",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0xdc42728b0ea910349ed3c6e1c9dc06b5fb591f98",
    stargateRouter: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
  },
  [Chain.BSC]: {
    crossChainWallet: "0x6d569eA24622540a63D589C10d5Ba899f8731409",
    crossChainRouter: "0xd9739B7acA106593a278AEfC2cC1392A43d5EF03",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0xd1C5966f9F5Ee6881Ff6b261BBeDa45972B1B5f3",
    stargateRouter: "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8",
  },
  [Chain.POLYGON]: {
    crossChainWallet: "0x6d569eA24622540a63D589C10d5Ba899f8731409",
    crossChainRouter: "0xd9739B7acA106593a278AEfC2cC1392A43d5EF03",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0x4f3Aff3A747fCADe12598081e80c6605A8be192F",
    stargateRouter: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  },
  [Chain.FANTOM]: {
    crossChainWallet: "0x193d11d674389302d9f9248ce050d5dac2941db2",
    crossChainRouter: "0xE918F6Fadb8E8Be2eDad063CEbBe23932F9c6b37",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4",
    stargateRouter: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6",
  },
  [Chain.ARBITRUM]: {
    crossChainWallet: "0xb4fDA86d41885ecE3672fD512446D75772EDb755",
    crossChainRouter: "0xdb91581407aec82d62cddae7c3fea82162fe26ab",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50",
    stargateRouter: "0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614",
  },
  [Chain.AVALANCHE]: {
    crossChainWallet: "0x739C6c8615C8864E2726123C4c8bE85102bB89b2",
    crossChainRouter: "0x8652EfDF8D03e589a18d830A9B64ba2dd3B7B1F6",
    paraswapApproveProxyAddress: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    paraswapSwapProvider: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
    multichainRouterProvider: "0xb0731d50c681c45856bfc3f7539d5f61d4be81d8",
    stargateRouter: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  },
};

export const StargateChain = {
  [Chain.MAINNET]: 101,
  [Chain.BSC]: 102,
  [Chain.AVALANCHE]: 106,
  [Chain.POLYGON]: 109,
  [Chain.ARBITRUM]: 110,
  [Chain.OPTIMISM]: 111,
  [Chain.FANTOM]: 112,
};

export const StargatePool = {
  [Chain.MAINNET]: {
    [usdcToken[Chain.MAINNET].address]: {
      id: 1,
      address: "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56",
      convertRate: "1",
    },
  },
  [Chain.POLYGON]: {
    [usdcToken[Chain.POLYGON].address]: {
      id: 1,
      address: "0x1205f31718499dBf1fCa446663B532Ef87481fe1",
      convertRate: "1",
    },
  },
  [Chain.ARBITRUM]: {
    [usdcToken[Chain.ARBITRUM].address]: {
      id: 1,
      address: "0x892785f33CdeE22A30AEF750F285E18c18040c3e",
      convertRate: "1",
    },
  },
  [Chain.AVALANCHE]: {
    [usdcToken[Chain.AVALANCHE].address]: {
      id: 1,
      address: "0x1205f31718499dBf1fCa446663B532Ef87481fe1",
      convertRate: "1",
    },
  },
  [Chain.BSC]: {
    [usdtToken[Chain.BSC].address]: {
      id: 2,
      address: "0x9aA83081AA06AF7208Dcc7A4cB72C94d057D2cda",
      convertRate: "1000000000000",
    },
  },
  [Chain.OPTIMISM]: {
    [usdcToken[Chain.OPTIMISM].address]: {
      id: 1,
      address: "0x1205f31718499dbf1fca446663b532ef87481fe1",
      convertRate: "1",
    },
  },
  [Chain.FANTOM]: {
    [usdcToken[Chain.FANTOM].address]: {
      id: 21,
      address: "0xc647ce76ec30033aa319d472ae9f4462068f2ad7",
      convertRate: "1",
    },
  },
};

export const abis: SmartContractAbis = {
  crossChainRouter: CrossChainRouterAbi,
  crossChainWallet: CrossChainWalletAbi,
};

export const CONFIG: Record<Chain, ChainData> = {
  [Chain.MAINNET]: {
    id: Chain.MAINNET,
    nativeToken: nativeToken[Chain.MAINNET],
    usdcToken: usdcToken[Chain.MAINNET],
    blockConfirmation: BlocksConfirmation[Chain.MAINNET],
    smartContracts: SmartContracts[Chain.MAINNET],
    abis,
  },
  [Chain.OPTIMISM]: {
    id: Chain.OPTIMISM,
    nativeToken: nativeToken[Chain.OPTIMISM],
    usdcToken: usdcToken[Chain.OPTIMISM],
    blockConfirmation: BlocksConfirmation[Chain.OPTIMISM],
    smartContracts: SmartContracts[Chain.OPTIMISM],
    abis,
  },
  [Chain.BSC]: {
    id: Chain.BSC,
    nativeToken: nativeToken[Chain.BSC],
    usdcToken: usdcToken[Chain.BSC],
    blockConfirmation: BlocksConfirmation[Chain.BSC],
    smartContracts: SmartContracts[Chain.BSC],
    abis,
  },
  [Chain.POLYGON]: {
    id: Chain.POLYGON,
    nativeToken: nativeToken[Chain.POLYGON],
    usdcToken: usdcToken[Chain.POLYGON],
    blockConfirmation: BlocksConfirmation[Chain.POLYGON],
    smartContracts: SmartContracts[Chain.POLYGON],
    abis,
  },
  [Chain.FANTOM]: {
    id: Chain.FANTOM,
    nativeToken: nativeToken[Chain.FANTOM],
    usdcToken: usdcToken[Chain.FANTOM],
    blockConfirmation: BlocksConfirmation[Chain.FANTOM],
    smartContracts: SmartContracts[Chain.FANTOM],
    abis,
  },
  [Chain.ARBITRUM]: {
    id: Chain.ARBITRUM,
    nativeToken: nativeToken[Chain.ARBITRUM],
    usdcToken: usdcToken[Chain.ARBITRUM],
    blockConfirmation: BlocksConfirmation[Chain.ARBITRUM],
    smartContracts: SmartContracts[Chain.ARBITRUM],
    abis,
  },
  [Chain.AVALANCHE]: {
    id: Chain.AVALANCHE,
    nativeToken: nativeToken[Chain.AVALANCHE],
    usdcToken: usdcToken[Chain.AVALANCHE],
    blockConfirmation: BlocksConfirmation[Chain.AVALANCHE],
    smartContracts: SmartContracts[Chain.AVALANCHE],
    abis,
  },
};

export const MULTICHAIN_MIN_CROSSCHAIN_USDC_AMOUNT = 12000000; //12 USDC
export const MULTICHAIN_MAX_CROSSCHAIN_USDC_AMOUNT = 20000000000000; // 20 000 000 USDC

export enum CrossRoute {
  BITOFTRADE = "bitoftrade",
  MULTICHAIN = "multichain",
  STARGATE = "stargate",
}

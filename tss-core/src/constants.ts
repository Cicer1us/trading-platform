export enum Chain {
  MAINNET = 1,
  OPTIMISM = 10,
  BSC = 56,
  POLYGON = 137,
  FANTOM = 250,
  ARBITRUM = 42161,
  AVALANCHE = 43114,
  GOERLI = 5,
}

export const BLOCKS_CONFIRMATIONS: Record<Chain, number> = {
  [Chain.MAINNET]: 6,
  [Chain.OPTIMISM]: 14, //https://help.coinbase.com/en/coinbase/getting-started/crypto-education/optimism
  [Chain.BSC]: 6,
  [Chain.POLYGON]: 55,
  [Chain.ARBITRUM]: 6, // not sure, can't find number of confirmations
  [Chain.AVALANCHE]: 1,
  [Chain.FANTOM]: 1,
  [Chain.GOERLI]: 5,
};

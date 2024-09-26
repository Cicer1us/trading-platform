import { initUtils } from '@bitoftrade/bof-utils';
import Web3 from 'web3';
import { Chain, chainConfigs } from './chains';

const web3Polygon = new Web3(chainConfigs[Chain.Polygon].rpcUrl);
const web3Ethereum = new Web3(chainConfigs[Chain.Ethereum].rpcUrl);
const web3Avalanche = new Web3(chainConfigs[Chain.Avalanche].rpcUrl);
const web3Bsc = new Web3(chainConfigs[Chain.Bsc].rpcUrl);
const web3Fantom = new Web3(chainConfigs[Chain.Fantom].rpcUrl);

export const bitoftradeUtils = initUtils({
  137: web3Polygon,
  1: web3Ethereum,
  56: web3Bsc,
  250: web3Fantom,
  43114: web3Avalanche,
});

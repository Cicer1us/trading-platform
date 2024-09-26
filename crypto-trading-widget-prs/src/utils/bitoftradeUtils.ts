// Temporary solution for release
// web3 1.7.5 version has error, which invokes in github actions while build
// either remove web3 from bof-utils package or use here another version
// TODO: fix incorrect web3 version issue

/* eslint-disable */
import { initUtils } from '@bitoftrade/bof-utils';
import Web3 from 'web3';
import { Chain, chainConfigs } from './chains';

const web3Polygon = new Web3(chainConfigs[Chain.Polygon].rpcUrl);
const web3Ethereum = new Web3(chainConfigs[Chain.Ethereum].rpcUrl);

export const bitoftradeUtils = initUtils({
  // @ts-ignore
  137: web3Polygon,
  // @ts-ignore
  1: web3Ethereum,
});

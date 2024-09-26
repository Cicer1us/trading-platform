import { initUtils } from '@bitoftrade/bof-utils';
import { CHAINS } from 'src/connection/chains';
import { ChainId } from 'src/connection/types';

const rpcMap = Object.keys(CHAINS).reduce<Record<string, string>>((acc, chain) => {
  acc[chain] = CHAINS[chain as ChainId].rpcUrls[0] as string;

  return acc;
}, {});

export const { getMultipleBalances, getMultipleAllowances, requestApprove } = initUtils(rpcMap);

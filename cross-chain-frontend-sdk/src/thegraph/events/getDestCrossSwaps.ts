import { Chain } from '@bitoftrade/cross-chain-core';
import { request, gql } from 'graphql-request';
import { batchRequest } from '../utils';
import { THE_GRAPH_URL } from '../theGraphUrls';

export interface DestCrossSwapVars {
  srcTxHashes: string[];
}

export interface DestCrossSwap extends DestCrossSwapEvent {
  destChainId: string;
}

export interface DestCrossSwapEvent {
  srcChainId: string;
  srcTransactionHash: string;
  destToken: string;
  destAmount: string;
  destUser: string;
  connectorToken: string;
  protocolFee: string;
  gasCompensation: string;
  initiator: string;
  txHash: string;
  txGasUsed: string;
  txGasPrice: string;
  blockHash: string;
  blockNumber: string;
  timestamp: string;
}

const query = gql`
  query ($srcTxHashes: [String]!) {
    destCrossSwaps(orderBy: timestamp, orderDirection: desc, where: { srcTransactionHash_in: $srcTxHashes }) {
      id
      srcChainId
      srcTransactionHash
      destToken
      destAmount
      destUser
      connectorToken
      protocolFee
      gasCompensation
      initiator
      txHash
      txGasUsed
      txGasPrice
      blockHash
      blockNumber
      timestamp
    }
  }
`;

const fetchDestCrossSwaps = async (chainId: Chain, variables: DestCrossSwapVars): Promise<DestCrossSwapEvent[]> => {
  const url = THE_GRAPH_URL[chainId];
  if (!url) return [];
  try {
    const response = await request<{
      destCrossSwaps: DestCrossSwapEvent[];
    }>(url, query, variables);
    return response?.destCrossSwaps ?? [];
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e?.message);
    }
    return [];
  }
};

export async function getDestCrossSwaps(
  txHashesByChain: Record<string, string[]>
): Promise<Record<string, DestCrossSwap[]>> {
  const params = Object.keys(txHashesByChain).reduce(
    (acc, chainId) => ({ ...acc, [chainId]: { srcTxHashes: txHashesByChain[chainId] } }),
    {}
  );
  const data: Record<string, DestCrossSwapEvent[]> = await batchRequest(fetchDestCrossSwaps, params);

  const destSwaps: Record<string, DestCrossSwap[]> = {};
  for (const chain of Object.keys(data)) {
    destSwaps[chain] = data[chain].map((event) => ({ ...event, destChainId: chain }));
  }
  return destSwaps;
}

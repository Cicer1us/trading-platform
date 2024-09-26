import { Chain, CrossRoute } from '@bitoftrade/cross-chain-core';
import { request, gql } from 'graphql-request';
import { batchRequest } from '../utils';
import { THE_GRAPH_URL } from '../theGraphUrls';

export interface SrcCrossSwapVars {
  first: number;
  initiator: string;
  srcTxHashes?: string[];
}

export interface SrcCrossSwap extends SrcCrossSwapEvent {
  srcChainId: string;
}

export interface SrcCrossSwapEvent {
  srcToken: string;
  srcAmount: string;
  destChainId: string;
  destToken: string;
  minDestAmount: string;
  destUser: string;
  connectorToken: string;
  connectorTokenIncome: string;
  refundAddress: string;
  liquidityProvider: CrossRoute;
  initiator: string;
  txHash: string;
  txGasUsed: string;
  txGasPrice: string;
  blockHash: string;
  blockNumber: string;
  timestamp: string;
}

const entityQuery = `
   srcToken
   srcAmount
   destChainId
   destToken
   minDestAmount
   destUser
   connectorToken
   connectorTokenIncome
   refundAddress
   liquidityProvider
   initiator
   txHash
   txGasUsed
   txGasPrice
   blockHash
   blockNumber
   timestamp
`;

const query = gql`
  query ($first: Int!, $initiator: String!) {
    srcCrossSwaps(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { initiator: $initiator }
    ) {
      ${entityQuery}
    }
  }
`;

const queryWithSrcTxHashesFilter = gql`
  query ($first: Int!, $initiator: String!, $srcTxHashes: [String]!) {
    srcCrossSwaps(
      first: $first
      orderBy: timestamp
      orderDirection: desc
      where: { initiator: $initiator, txHash_in: $srcTxHashes }
    ) {
      ${entityQuery}
    }
  }
`;

const fetchSrcCrossSwaps = async (chainId: Chain, variables: SrcCrossSwapVars): Promise<SrcCrossSwapEvent[]> => {
  const url = THE_GRAPH_URL[chainId];
  if (!url) return [];
  try {
    // for empty srcTxHashes array thegraph response always will be empty
    if (variables?.srcTxHashes && variables?.srcTxHashes.length === 0) {
      return [];
    }

    const response = await request<{
      srcCrossSwaps: SrcCrossSwapEvent[];
    }>(url, variables?.srcTxHashes ? queryWithSrcTxHashesFilter : query, variables);
    return response?.srcCrossSwaps ?? [];
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e?.message);
    }
    return [];
  }
};

export async function getSrcCrossSwaps(
  params: SrcCrossSwapVars,
  srcTxHashes?: Record<string, string[]>
): Promise<Record<string, SrcCrossSwap[]>> {
  const batchParams: Record<number, SrcCrossSwapVars> = Object.keys(Chain)
    .filter((chainId) => !isNaN(Number(chainId)))
    .reduce(
      (acc, chainId) => ({
        ...acc,
        [chainId]: {
          ...params,
          ...(srcTxHashes ? { srcTxHashes: srcTxHashes?.[chainId] ?? [] } : {})
        }
      }),
      {}
    );
  // TODO: add only first 10 sorted by timestamp
  const data: Record<string, SrcCrossSwapEvent[]> = await batchRequest(fetchSrcCrossSwaps, batchParams);

  const srcSwaps: Record<string, SrcCrossSwap[]> = {};
  for (const chain of Object.keys(data)) {
    srcSwaps[chain] = data[chain].map((event) => ({ ...event, srcChainId: chain }));
  }

  return srcSwaps;
}

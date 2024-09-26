import { Chains } from 'connection/chainConfig';
import { ParaswapSwap } from '@/interfaces/Paraswap.interface';
import THE_GRAPH_PARASWAP_URL from 'constants/theGraphParaswapUrl';
import { request, gql } from 'graphql-request';

interface FetchSwapsVariables {
  referrer: string;
  initiator: string;
}

const query = gql`
  query ($referrer: String!, $initiator: String!) {
    swaps(orderBy: timestamp, orderDirection: desc, where: { referrer: $referrer, initiator: $initiator }) {
      id
      initiator
      srcToken
      destToken
      srcAmount
      destAmount
      referrer
      paraswapFee
      referrerFee
      feeCode
      feeToken
      txHash
      txGasUsed
      txGasPrice
      blockNumber
      timestamp
    }
  }
`;

export const fetchSwaps = async (chainId: Chains, variables: FetchSwapsVariables): Promise<ParaswapSwap[]> => {
  const url = THE_GRAPH_PARASWAP_URL[chainId];
  if (url) {
    try {
      const response = await request<{ swaps: ParaswapSwap[] }>(url, query, variables);
      return response?.swaps ?? [];
    } catch (e) {
      console.error(e.message);
      return [];
    }
  }
};

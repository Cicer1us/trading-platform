import { SrcCrossSwap } from './events/getSrcCrossSwaps';

export async function batchRequest<T>(request: any, params: any): Promise<Record<string, T[]>> {
  try {
    const requests = [];
    const chains: string[] = Object.keys(params);

    for (const chainId of Object.keys(params)) {
      requests.push(request(Number(chainId), params[chainId]));
    }

    const responses = await Promise.all(requests);
    const responseData: Record<string, any> = {};

    responses.forEach((response, index) => {
      const chainId = chains[index];
      responseData[chainId] = response;
    });
    return responseData;
  } catch (e) {
    return {};
  }
}

export function extractSrcTxHashFromSrcSwaps(events: SrcCrossSwap[]) {
  const data: Record<string, string[]> = {};

  for (const event of events) {
    if (data[event.destChainId]) {
      data[event.destChainId].push(event.txHash);
    } else {
      data[event.destChainId] = [event.txHash];
    }
  }

  return data;
}

import { CrossChainSwap } from '../cross-chain/types';
import { DestCrossSwap, getDestCrossSwaps } from './events/getDestCrossSwaps';
import { SrcCrossSwap, getSrcCrossSwaps } from './events/getSrcCrossSwaps';
import { extractSrcTxHashFromSrcSwaps } from './utils';

export async function getCrossSwaps(
  userAddress: string,
  srcTxHashes?: Record<string, string[]>
): Promise<CrossChainSwap[]> {
  const srcCrossSwaps = await getSrcCrossSwaps({ first: 10, initiator: userAddress }, srcTxHashes);
  const srcTxHashesByDestChain = extractSrcTxHashFromSrcSwaps(Object.values(srcCrossSwaps).flat());
  const destCrossSwaps = await getDestCrossSwaps(srcTxHashesByDestChain);

  return mergeSrcAndDestEvents(srcCrossSwaps, destCrossSwaps);
}

function mergeSrcAndDestEvents(
  srcCrossSwap: Record<string, SrcCrossSwap[]>,
  destCrossSwap: Record<string, DestCrossSwap[]>
): CrossChainSwap[] {
  const crossSwaps = [];

  for (const chain of Object.keys(srcCrossSwap)) {
    for (const srcTx of srcCrossSwap[chain]) {
      const destTx = destCrossSwap[srcTx.destChainId].find((event) => event.srcTransactionHash === srcTx.txHash);
      crossSwaps.push({
        srcTx,
        destTx: destTx ?? null,
        route: srcTx.liquidityProvider
      });
    }
  }

  return crossSwaps;
}

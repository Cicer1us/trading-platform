import { CHAINS } from 'src/connection/chains';
import { ChainId } from 'src/connection/types';

type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<A>(arr: Array<A>): arr is NonEmptyArray<A> {
  return arr.length > 0;
}

export function isSupportedChain(chainId: ChainId | undefined): chainId is ChainId {
  return !!chainId && !!CHAINS[chainId];
}

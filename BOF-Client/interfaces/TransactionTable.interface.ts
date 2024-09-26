import { Chains } from 'connection/chainConfig';

export interface TokenColumn {
  symbol: string;
  logoURI: string;
  value?: number;
  link?: string;
}

export interface HashColumn {
  hash: string;
  chainId: Chains;
}

export interface TableTx<T> {
  raw: T;
  sentToken: TokenColumn;
  receivedToken: TokenColumn;
  hash: HashColumn;
  date: string;
  feesUSD: string;
}

import axios from 'axios';
export interface GetNtfsByWalletResponse {
  total: number;
  page: number;
  page_size: number;
  cursor: string | null;
  result: Nft[];
  status: 'SYNCED' | 'SYNCING';
}

export type Attribute = {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage' | 'date' | 'string' | 'url' | 'transferrable' | 'boolean';
  max_value?: number;
  trait_count?: number;
  order?: number;
};

export type NormalizedMetadata = {
  name: string;
  description: string;
  image: string;
  external_link?: string;
  animation_url?: string;
  attributes?: Attribute[];
};

export interface Nft {
  amount: string;
  block_number: string;
  block_number_minted: string;
  contract_type: 'ERC721' | 'ERC1155';
  last_metadata_sync: string;
  last_token_uri_sync: string;
  metadata: string;
  normalized_metadata: NormalizedMetadata;
  minter_address: string;
  name: string;
  description: string;
  owner_of: string;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: string;
  token_uri: string;
}

export type GetNftsByWalletParams = {
  address: string;
  chain: string;
  cursor?: string;

  format?: string;
  limit?: number;
  disable_total?: boolean;
  token_addresses?: string;
  normalizeMetadata?: boolean;
  media_items?: boolean;
};

const baseURL = process.env.NEXT_PUBLIC_MORALIS_PROXY_URL;

type ConstructFetchNftsInput = {
  address: string;
  chain: string;
};

type FetchNftsInput = {
  cursor?: GetNtfsByWalletResponse['cursor'];
  signal?: AbortSignal;
};
export const constructFetchNfts =
  ({ address, chain }: ConstructFetchNftsInput) =>
  async ({ cursor, signal }: FetchNftsInput) => {
    const res = await axios.get<GetNtfsByWalletResponse>(`api/v2/${address}/nft`, {
      baseURL,
      signal,
      params: {
        normalizeMetadata: true,
        disable_total: true,
        limit: 100,
        cursor,
        chain,
        address,
      },
    });

    return res.data;
  };

export const getNftMetadata = (address: string, tokenId: string, chainName: string) => {
  return axios.get(`api/v2/nft/${address}/${tokenId}`, {
    baseURL,
    params: {
      chain: chainName,
      normalizeMetadata: true,
    },
  });
};

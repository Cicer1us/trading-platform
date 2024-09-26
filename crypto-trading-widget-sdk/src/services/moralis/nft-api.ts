import axios from 'axios';
import { NormalizedMetadata } from '../../hooks/useGetNftMetadata';

export interface GetNtfsByWalletResponse {
  total: number;
  page: number;
  page_size: number;
  cursor: string | null;
  result: Nft[];
  status: 'SYNCED' | 'SYNCING';
}

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

const MORALIS_BASE_URL = 'https://bof-v2-server-prod-docker.azurewebsites.net/moralis';

export const getNftsByWallet = async (address: string, chainName: string): Promise<GetNtfsByWalletResponse> => {
  const res = await axios.get(`api/v2/${address}/nft`, {
    baseURL: MORALIS_BASE_URL,
    params: {
      chain: chainName,
      normalizeMetadata: true,
      disable_total: true,
    },
  });
  return res.data;
};

export const getNftMetadata = async (address: string, tokenId: string, chainName: string): Promise<Nft> => {
  const res = await axios.get(`api/v2/nft/${address}/${tokenId}`, {
    baseURL: MORALIS_BASE_URL,
    params: {
      chain: chainName,
      normalizeMetadata: true,
      disable_total: true,
    },
  });
  return res.data;
};

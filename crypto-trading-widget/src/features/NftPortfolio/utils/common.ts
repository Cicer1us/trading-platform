import { NFTOrderFromAPI } from '@paraswap/sdk';
import { Nft } from 'services/moralis/nft-api';

export const getShortedAddress = (address: string) => {
  if (address.length > 10) {
    const len = address.length;
    address = address.slice(0, 4) + '...' + address.slice(len - 4, len);
  }
  return address;
};

export const sliceTextAndAddDotsOnTheEnd = (text: string, length: number) => {
  return text.slice(0, length) + '...';
};

export const getNftIdentifier = (address: string, id: string) => `${address}-${id}`;

export const toByTokenAddressAndTokenId = (nfts: Nft[]) => {
  return nfts.reduce<Record<string, Record<string, Nft>>>((acc, current) => {
    if (!acc[current.token_address]) {
      acc[current.token_address] = {};
    }
    acc[current.token_address.toLowerCase()][current.token_id.toLowerCase()] = current;
    return acc;
  }, {});
};

export const getNftsWithOrders = (nfts: Nft[], orders: NFTOrderFromAPI[]) => {
  const nftsListMap = toByTokenAddressAndTokenId(nfts);

  return orders.reduce<Nft[]>((acc, current) => {
    const nft = nftsListMap[current.makerAsset.toLowerCase()]?.[current.makerAssetId.toLowerCase()];
    if (nft) {
      acc.push(nft);
    }
    return acc;
  }, []);
};

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { NO_NFT_IMAGE_PATH, UNKNOWN_NFT_NAME } from '../../../constants';
import { Nft } from 'services/moralis/nft-api';
import { Attribute } from 'services/moralis/nft-api';

export interface NftMetadata {
  name: string;
  description?: string | null;
  imageUrl?: string;
  animationUrl?: string | null;
  externalLink?: string | null;
  attributes?: Attribute[];
}

export const modifyImgUrlIfNeeded = (url?: string) => {
  if (!url) {
    return NO_NFT_IMAGE_PATH;
  }

  if (url.slice(0, 7) === 'ipfs://') {
    url = 'https://ipfs.io/ipfs/' + url.slice(7, url.length);
  }

  return url;
};

export const useNftNormalizedMetadata = (nft?: Nft) => {
  const normalizedMetadata = nft?.normalized_metadata;
  const tokenUri = nft?.token_uri;
  const isMetadataExist = normalizedMetadata?.name && normalizedMetadata?.description;

  const fetchMetadata = async ({ signal }: { signal?: AbortSignal }) => {
    if (!isMetadataExist && tokenUri) {
      // if metadata is not exist, we fetch it from tokenUri
      // otherwise we use metadata from current nft
      try {
        const response = await axios.get(tokenUri, { signal });
        const tokenUriData = response.data;

        const normalizedTokenMetadata = {
          name: tokenUriData.name || UNKNOWN_NFT_NAME,
          description: tokenUriData.description || UNKNOWN_NFT_NAME,
          imageUrl: modifyImgUrlIfNeeded(tokenUriData.image || tokenUriData.nft.url),
          animationUrl: tokenUriData.animation_url,
          externalLink: tokenUriData.external_link,
          attributes: tokenUriData.attributes,
        };

        return normalizedTokenMetadata;
      } catch (error) {
        // if no data in tokenUri, return unknown nft

        return {
          name: nft.name || UNKNOWN_NFT_NAME,
          description: nft.description || UNKNOWN_NFT_NAME,
          imageUrl: NO_NFT_IMAGE_PATH,
          animationUrl: '',
          externalLink: '',
          attributes: [],
        };
      }
    } else {
      return {
        name: normalizedMetadata?.name || nft?.name || UNKNOWN_NFT_NAME,
        description: normalizedMetadata?.description || nft?.description || UNKNOWN_NFT_NAME,
        imageUrl: modifyImgUrlIfNeeded(normalizedMetadata?.image),
        animationUrl: normalizedMetadata?.animation_url,
        externalLink: normalizedMetadata?.external_link,
        attributes: normalizedMetadata?.attributes,
      };
    }
  };

  return useQuery(['nftMetadata', nft?.token_address, nft?.token_id], async ({ signal }) => fetchMetadata({ signal }), {
    enabled: !!nft,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};

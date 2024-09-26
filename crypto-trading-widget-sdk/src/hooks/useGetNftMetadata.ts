import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getNftMetadata, Nft } from 'services/moralis/nft-api';
import { Chain, chainConfigs } from 'utils/chains';
import { NO_NFT_IMAGE_URL } from '../constants';

// Set the interval to 24 hours because we don't want to refetch metadata too often
const REFETCH_INTERVAL = 1000 * 60 * 60 * 24;

export type Attribute = {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage' | 'date' | 'string' | 'url' | 'transferable' | 'boolean';
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

export const normalizeImageUrl = (url?: string) => {
  if (!url) {
    return NO_NFT_IMAGE_URL;
  }

  if (url.slice(0, 7) === 'ipfs://') {
    return 'https://ipfs.io/ipfs/' + url.slice(7, url.length);
  }

  return url;
};

export const useNftNormalizedMetadata = (nft?: Nft) => {
  const normalizedMetadata = nft?.normalized_metadata;
  const tokenUri = nft?.token_uri;
  const isMetadataExist = normalizedMetadata?.name && normalizedMetadata?.description;

  const fetchMetadata = async () => {
    if (!isMetadataExist && tokenUri) {
      // if metadata is not exist, we fetch it from tokenUri
      // otherwise we use metadata from current nft
      try {
        const response = await axios.get(tokenUri);
        const tokenUriData = response.data;

        return {
          name: tokenUriData.name,
          description: tokenUriData.description,
          imageUrl: normalizeImageUrl(tokenUriData.image),
          animationUrl: tokenUriData.animation_url,
          externalLink: tokenUriData.external_link,
          attributes: tokenUriData.attributes,
        };
      } catch (error) {
        // if no data in tokenUri, return unknown nft
        return {
          name: nft.name || 'Unknown',
          description: nft.description || 'Unknown',
          imageUrl: NO_NFT_IMAGE_URL,
          animationUrl: '',
          externalLink: '',
          attributes: [],
        };
      }
    } else {
      return {
        name: normalizedMetadata?.name,
        description: normalizedMetadata?.description,
        imageUrl: normalizeImageUrl(normalizedMetadata?.image),
        animationUrl: normalizedMetadata?.animation_url,
        externalLink: normalizedMetadata?.external_link,
        attributes: normalizedMetadata?.attributes,
      };
    }
  };

  return useQuery(['normalizedNftMetadata', normalizedMetadata, tokenUri], fetchMetadata, {
    enabled: !!nft,
    cacheTime: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

export const useGetNftMetadata = (nftAddress: string, tokenId: string, chain: Chain) => {
  return useQuery({
    queryKey: ['nftMetadata', nftAddress, tokenId, chain],
    queryFn: () => getNftMetadata(nftAddress, tokenId, chainConfigs[chain].moralisName),
    enabled: !!nftAddress?.length && !!tokenId?.length,
    cacheTime: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

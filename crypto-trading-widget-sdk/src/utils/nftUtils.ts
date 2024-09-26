import { isString, isUndefined } from './typeGuards';

const modifyIfNeeded = (url: string) => {
  if (url.slice(0, 7) === 'ipfs://') {
    url = 'https://ipfs.io/ipfs/' + url.slice(7, url.length);
  }
  return url;
};

const getNftImage = (json: Record<string, any>) => {
  let imageUrl;
  if (json?.image?.length > 0) {
    imageUrl = modifyIfNeeded(json.image);
  } else if (json?.nft?.url) {
    imageUrl = modifyIfNeeded(json.nft.url);
  } else if (json?.image_url.length > 0) {
    imageUrl = modifyIfNeeded(json?.image_url);
  }
  return imageUrl;
};
export interface NftMetadata {
  name: string;
  description?: string | null;
  imageUrl?: string;
  animationUrl?: string | null;
}

export const parseNftMetadata = (metadata: string): NftMetadata => {
  const json = JSON.parse(metadata);

  const name = json?.name;
  const imageUrl = getNftImage(json) ?? '';
  const animationUrl = json?.animationUrl ? modifyIfNeeded(json?.animationUrl) : undefined;
  const description = json?.description ?? '';

  if (!isString(imageUrl)) {
    throw new Error('Cannot get nft image url');
  }

  if (!isString(name)) {
    throw new Error('Cannot get nft name');
  }

  if (!isString(animationUrl) && !isUndefined(animationUrl)) {
    throw new Error('animationUrl must be string or undefined');
  }

  if (!isString(description) && !isUndefined(description)) {
    throw new Error('Metadata description must be string or undefined');
  }

  return {
    name,
    imageUrl,
    description,
    animationUrl,
  };
};

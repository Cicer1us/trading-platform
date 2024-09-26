import { SwappableNFTOrder } from '@paraswap/sdk';
import { Chain, chainConfigs } from 'utils/chains';

export const getExplorerNftUrl = (order: SwappableNFTOrder, chain: Chain): string =>
  new URL(`token/${order.makerAsset}?a=${order.makerAssetId}`, chainConfigs[chain].explorerUrl).toString();

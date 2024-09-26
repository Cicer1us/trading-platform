import { TabsList } from '@/redux/redux.enum';
import {
  availableChainsCrossSwap,
  availableChainsLeverage,
  availableChainsLimit,
  availableChainsSwap,
} from '@/common/constants';

export const getChainsForService = (tab: TabsList, isTradingFeatureRoute?: boolean) => {
  if (!isTradingFeatureRoute) {
    return availableChainsSwap;
  }

  if (tab === TabsList.SWAP) {
    return availableChainsSwap;
  } else if (tab === TabsList.LIMIT) {
    return availableChainsLimit;
  } else if (tab === TabsList.LEVERAGE) {
    return availableChainsLeverage;
  } else if (tab === TabsList.CROSS_CHAIN) {
    return availableChainsCrossSwap;
  }
};

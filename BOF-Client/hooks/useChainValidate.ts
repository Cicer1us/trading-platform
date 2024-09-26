import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { TabsList } from '@/redux/redux.enum';
import {
  availableChainsCrossSwap,
  availableChainsLeverage,
  availableChainsLimit,
  availableChainsSwap,
} from '@/common/constants';

const useChainValidate = () => {
  const appChainId = useAppSelector(({ app }) => app.chainId);

  const { chainId: userChainId } = useWeb3React();
  const tab = useAppSelector(({ widget }) => widget.tab);

  const availableForSelectedFeature = () => {
    let result;

    if (tab === TabsList.SWAP) {
      result = availableChainsSwap.find(chain => chain === appChainId);
    } else if (tab === TabsList.LIMIT) {
      result = availableChainsLimit.find(chain => chain === appChainId);
    } else if (tab === TabsList.LEVERAGE) {
      result = availableChainsLeverage.find(chain => chain === appChainId);
    } else if (tab === TabsList.CROSS_CHAIN) {
      result = availableChainsCrossSwap.find(chain => chain === appChainId);
    }
    return result ? true : false;
  };

  const isAvailableForCurrentService = availableForSelectedFeature();
  const isConnected = !!userChainId;
  const isWrongChain = !userChainId || !isAvailableForCurrentService;

  return { isWrongChain, isAvailableForCurrentService, isConnected };
};

export default useChainValidate;

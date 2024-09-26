import { Chains, chains } from 'connection/chainConfig';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { TabsList } from '@/redux/redux.enum';
import { setSelectedTokens, setTab } from '@/redux/widgetSlice';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedMarket } from '@/redux/leverageSlice';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import { leverageAssets } from '@/helpers/leverageTrade/constants';
import topLists from '@/helpers/topLists';
import { availableChainsCrossSwap } from '@/common/constants';
import { DEFAULT_STABLE_TOKEN } from 'constants/tokens';

export const SyncTokensTabWithURL = ({ children }) => {
  const router = useRouter();
  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokens = useAppSelector(({ widget }) => widget.tokensList);
  const tab = useAppSelector(({ widget }) => widget.tab);
  const tokensListIsLoaded = useAppSelector(({ widget }) => widget.tokensListIsLoaded);
  const dispatch = useDispatch();

  const setDefault = (tab?: TabsList) => {
    if (tab === TabsList.CROSS_CHAIN) setDefaultCrossSwap();
    else if (tab === TabsList.SWAP || (tab === TabsList.LIMIT && chainId !== Chains.MAINNET)) setDefaultSwap();
    else if (tab === TabsList.LIMIT) setDefaultLimit();
    else setDefaultLeverage();
  };

  const setDefaultLeverage = () => {
    // TODO: create enum for leverage markets and use it here
    dispatch(setSelectedMarket('ETH'));
    dispatch(setTab(TabsList.LEVERAGE));
  };

  const getDefaultStableToken = (chainId: Chains) => {
    return DEFAULT_STABLE_TOKEN[chainId];
  };

  const getDefaultNativeToken = (chainId: Chains) => {
    const nativeToken = chains[chainId].nativeToken.address;
    const native = tokens[chainId].find(token => token?.address.toLowerCase() === nativeToken);
    if (native) return native;
    const weth = tokens[chainId].find(token => token?.symbol === 'WETH');
    if (weth) return weth;
    return tokens[chainId][0];
  };

  const setDefaultCrossSwap = () => {
    const srcTokenChainId = availableChainsCrossSwap.some(availableChain => chainId === availableChain)
      ? chainId
      : availableChainsCrossSwap[0];
    const destTokenChainId = availableChainsCrossSwap.find(chain => chain !== srcTokenChainId);
    const selectedTokenA = getDefaultStableToken(srcTokenChainId);
    const nativeToken = getDefaultNativeToken(destTokenChainId);
    dispatch(setSelectedTokens({ tokenA: selectedTokenA, tokenB: nativeToken }));
    dispatch(setTab(TabsList.CROSS_CHAIN));
  };

  const setDefaultSwap = () => {
    const selectedTokenA = getDefaultStableToken(chainId);
    const nativeToken = getDefaultNativeToken(chainId);
    console.log(selectedTokenA, nativeToken);
    dispatch(setSelectedTokens({ tokenA: selectedTokenA, tokenB: nativeToken }));
    dispatch(setTab(TabsList.SWAP));
  };

  const setDefaultLimit = () => {
    const selectedTokenA = getDefaultStableToken(chainId);
    const nativeToken = chains[chainId].nativeToken.address;
    const topToken = topLists[chainId].find(t => t !== nativeToken);
    // TODO: change topList to list of addresses then compare by address, not by symbol
    const selectedTokenB = tokens[chainId].find(token => token?.symbol === topToken);
    dispatch(setSelectedTokens({ tokenA: selectedTokenA, tokenB: selectedTokenB }));
    dispatch(setTab(TabsList.LIMIT));
  };

  const checkValidTokens = (tab: TabsList, firstToken: string, secondToken: string): boolean => {
    // TODO: add src/dest token chain id, then add implementation for cross tokens validation check
    if (tab === TabsList.CROSS_CHAIN) {
      return false;
    }
    if (tab === TabsList.LEVERAGE) {
      return checkLeverageTokens(firstToken, secondToken);
    }
    return checkSwapLimitTokens(tab, firstToken, secondToken);
  };

  const checkLeverageTokens = (selectedMarket: string, usdcMarket: string): boolean => {
    if (usdcMarket?.toUpperCase() !== BASIC_LEVERAGE_TOKEN) return false;
    const isLeverage = leverageAssets.some(lev => lev === selectedMarket.toUpperCase());
    return isLeverage;
  };

  const checkSwapLimitTokens = (tab: TabsList, firstToken: string, secondToken: string) => {
    if (firstToken === secondToken) return false;
    const nativeToken = chains[chainId].nativeToken.address.toLowerCase();
    if (tab === TabsList.LIMIT && (firstToken === nativeToken || secondToken === nativeToken)) return false;
    const isAnalogFirstToken = tokens[chainId].some(t => t.address.toLowerCase() === firstToken);
    const isAnalogSecondToken = tokens[chainId].some(t => t.address.toLowerCase() === secondToken);
    return isAnalogFirstToken && isAnalogSecondToken;
  };

  const setTokens = (firstToken: string, secondToken: string, tab: TabsList) => {
    if (tab === TabsList.LEVERAGE) {
      dispatch(setSelectedMarket(firstToken));
      dispatch(setTab(TabsList.LEVERAGE));
    } else {
      const selectedTokenA = tokens[chainId].find(token => token?.address.toLowerCase() === firstToken);
      const selectedTokenB = tokens[chainId].find(token => token?.address.toLowerCase() === secondToken);
      dispatch(setSelectedTokens({ tokenA: selectedTokenA, tokenB: selectedTokenB }));
      dispatch(setTab(tab));
    }
  };

  const verifyTokensFromURL = () => {
    // also apply this for chain switching

    // for swap and limit srcToken and destToken are token addresses
    // fot leverage srcToken is selected dydx market and destToken should be USDC
    const { srcToken, destToken, tab } = router.query as { tab: string; srcToken: string; destToken: string };
    const widgetTab = tab?.toString().toLowerCase();
    const firstToken = srcToken?.toString().toLowerCase();
    const secondToken = destToken?.toString().toLowerCase();
    const validTab = Object.entries(TabsList).find(([, value]) => value.toLowerCase() === widgetTab);
    const userTab = TabsList[validTab?.[0]];

    // set tokens from url only after load
    if (tokensListIsLoaded) {
      if (!userTab || !checkValidTokens(userTab, firstToken, secondToken)) {
        setDefault(userTab);
      } else {
        setTokens(firstToken, secondToken, userTab);
      }
    }
  };

  useEffect(() => {
    verifyTokensFromURL();
  }, [router.query, tokensListIsLoaded]);

  useEffect(() => {
    if (tab !== TabsList.CROSS_CHAIN) {
      verifyTokensFromURL();
    }
  }, [chainId]);

  return <>{children}</>;
};

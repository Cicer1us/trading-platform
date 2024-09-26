import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from 'src/store/hooks/reduxHooks';
import { usePaymentPrice } from './usePayment';
import { useTokenAllowances } from './useTokensAllowances';
import { useTokensBalances } from './useTokensBalances';
import { NATIVE_TOKEN } from 'src/common/constants';

type UsePaymentConditionResult = {
  isInsufficientAllowance: boolean;
  isInsufficientBalance: boolean;
  isWrongChain: boolean;
  isLoading: boolean;
};

export const usePaymentCondition = (): UsePaymentConditionResult => {
  const { selectedChainId, selectedToken } = useAppSelector(({ payment }) => payment);
  const { chainId } = useWeb3React();
  const { data: orderPrice, isLoading: orderPriceIsLoading } = usePaymentPrice();

  const { data: tokensBalances, isFetching: tokensBalancesIsFetching } = useTokensBalances(selectedChainId);
  const { data: tokensAllowances, isFetching: tokensAllowancesIsFetching } = useTokenAllowances(selectedChainId);

  // TODO: convert to wei
  // TODO: turn isInsufficientAllowance to false if selectedToken is native token
  const isInsufficientAllowance =
    selectedToken.address === NATIVE_TOKEN
      ? false
      : Number(tokensAllowances?.[selectedToken.address]?.humanAmount) < Number(orderPrice?.payInHumanAmount);
  // TODO: convert to wei
  const isInsufficientBalance =
    Number(tokensBalances?.[selectedToken.address]?.humanAmount) < Number(orderPrice?.payInHumanAmount);

  const isWrongChain = Number(selectedChainId) !== chainId;

  const isLoading = orderPriceIsLoading || tokensBalancesIsFetching || tokensAllowancesIsFetching;

  return {
    isInsufficientAllowance,
    isInsufficientBalance,
    isWrongChain,
    isLoading
  };
};

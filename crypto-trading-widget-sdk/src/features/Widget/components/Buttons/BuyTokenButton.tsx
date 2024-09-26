import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { WalletCtx } from '../../../../context/WalletContext';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks/reduxHooks';
import { setButtonError, setCurrentScreen, setTransactionObject } from '../../../../redux/appSlice';
import { createSwap, getPriceRouteWithDeviation } from '@bitoftrade/bof-utils';
import { chainConfigs } from '../../../../utils/chains';
import { FEE, PARTNER } from '../../../../constants';
import { AppState, WidgetScreen } from '../../../../redux/app.interface';
import BigNumber from 'bignumber.js';
import { ContainedButton } from '../../../../components/Buttons/ContainedButton';
import { useTokenAllowances } from 'hooks/useTokenAllowances';
import { OngoingTransactionsCtx } from 'context/OngoingTransactionsContext';
import { assert } from 'ts-essentials';

interface BuyTokenButtonProps {
  isInsufficientBalance?: boolean;
}

export const BuyTokenButton: React.FC<BuyTokenButtonProps> = ({ isInsufficientBalance }) => {
  const dispatch = useAppDispatch();
  const ctx = useContext(WalletCtx);
  const { ongoingTransactions } = useContext(OngoingTransactionsCtx);
  const appSelector: AppState = useAppSelector(({ app }) => app);
  const selectedChain = useAppSelector(({ app }) => app.selectedChain);
  const swapTxInProgress = useAppSelector(({ app }) => app.swapTxInProgress);
  const youPayAmount = useAppSelector(({ app }) => app.youPay.amount);
  const youPayToken = useAppSelector(({ app }) => {
    const tokens = app.tokenListMap[app.selectedChain].tokens;
    return tokens[app.tokenListMap[app.selectedChain].youPayToken];
  });
  const youReceiveToken = useAppSelector(({ app }) => {
    const tokens = app.tokenListMap[app.selectedChain].tokens;
    return tokens[app.tokenListMap[app.selectedChain].youReceiveToken];
  });
  assert(youPayToken && youReceiveToken, 'Tokens should be defined');

  const { data: tokenAllowances, isFetching: tokenAllowancesIsFetching } = useTokenAllowances(
    ctx?.account ?? '',
    selectedChain
  );

  const isInsufficientAllowance = tokenAllowances
    ? /**
       * if tokenAllowances is defined, check if the allowance is sufficient
       * if tokenAllowances is undefined, we assume that the allowance is sufficient by using Infinity
       */
      BigNumber(youPayAmount).isGreaterThan(tokenAllowances[youPayToken.address] ?? Infinity)
    : false;

  const isTransactionPending = useMemo(() => {
    return ongoingTransactions.some((tx: any) => tx.tokenAddress === youPayToken.address && tx.status === 'pending');
  }, [ongoingTransactions, youPayToken.address]);

  const isTokensTheSame = youPayToken.address === youReceiveToken.address;

  const [loading, setLoading] = useState(false);
  const [wrongChain, setWrongChain] = useState(false);

  useEffect(() => {
    if (selectedChain !== ctx?.walletChain) {
      setWrongChain(true);
    } else {
      setWrongChain(false);
    }
  }, [selectedChain, ctx?.walletChain]);

  const confirmTxButtonDisabled =
    isInsufficientBalance ||
    appSelector.youPay.loading ||
    appSelector.youReceive.loading ||
    (appSelector.youPay.amount == '' && !wrongChain) ||
    loading ||
    appSelector.buttonError !== null ||
    swapTxInProgress ||
    isTransactionPending ||
    tokenAllowancesIsFetching ||
    isTokensTheSame;

  const handleSwapCreation = async () => {
    if (!appSelector.priceRoute) return;
    const prices = getPriceRouteWithDeviation(appSelector.priceRoute);
    if (!ctx?.account || !ctx?.library) return;

    /**
     * TODO: handle swap creation with useMutation hook
     */

    setLoading(true);
    const swapTxObject = await createSwap(
      ctx.account,
      prices.destAmount,
      prices.srcAmount,
      appSelector.priceRoute,
      chainConfigs[appSelector.selectedChain].eip1559,
      PARTNER,
      FEE
    );
    setLoading(false);

    if (swapTxObject.error) {
      dispatch(setButtonError(swapTxObject.error));
    } else {
      dispatch(setTransactionObject(swapTxObject));
      dispatch(setCurrentScreen(WidgetScreen.ConfirmTransaction));
    }
  };

  const onClick = async () => {
    if (isInsufficientAllowance) {
      dispatch(setCurrentScreen(WidgetScreen.UnlockAsset));
      return;
    }

    if (wrongChain) {
      await ctx?.selectChain(appSelector.selectedChain);
      return;
    }

    await handleSwapCreation();
  };

  const buttonLabel = wrongChain
    ? `Switch to ${chainConfigs[appSelector.selectedChain].name}`
    : appSelector.buttonError
    ? appSelector.buttonError
    : swapTxInProgress
    ? 'Transaction in progress'
    : isInsufficientBalance
    ? 'Insufficient funds'
    : isInsufficientAllowance
    ? (isTransactionPending || tokenAllowancesIsFetching ? 'Unlocking' : 'Unlock') + ` ${youPayToken.symbol}`
    : `Buy ${youReceiveToken.symbol}`;

  return (
    <>
      {!ctx?.account ? (
        <ContainedButton fullWidth onClick={() => dispatch(setCurrentScreen(WidgetScreen.ConnectWallet))}>
          {'Connect Wallet'}
        </ContainedButton>
      ) : (
        <ContainedButton
          fullWidth
          onClick={onClick}
          customIsLoading={isTransactionPending || tokenAllowancesIsFetching}
          disabled={confirmTxButtonDisabled}
          endIcon={(loading || swapTxInProgress) && <CircularProgress />}
        >
          {buttonLabel}
        </ContainedButton>
      )}
    </>
  );
};

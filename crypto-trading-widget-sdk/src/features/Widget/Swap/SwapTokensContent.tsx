import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Clarification } from 'components/Clarification/Clarification';
import { AssetInput } from 'components/AssetInput/AssetInput';
import { TransactionInfo } from './TransactionInfo';
import React, { useContext } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks/reduxHooks';
import { FlipTokensButton } from 'features/Widget/components/Buttons/FlipTokensButton';
import { WalletCtx } from 'context/WalletContext';
import { useCalculatePrice } from './useCalculatePrice';
import { BuyTokenButton } from 'features/Widget/components/Buttons/BuyTokenButton';
import { convertInputStringToNumber } from 'utils/common';
import { WidgetScreen } from 'redux/app.interface';
import { setPay } from 'redux/appSlice';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useTokenBalances } from 'hooks/useTokenBalances';
import { balancesObjectToArray, getTokenBalanceInfo } from 'utils/balancesObjectToArray';
import BigNumber from 'bignumber.js';
import { useTokenAllowances } from 'hooks/useTokenAllowances';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { SwapTokensHeadLine } from './SwapTokensHeadLine/SwapTokensHeadLine';
import assert from 'assert';
import { InputError, inputErrors } from 'utils/inputErrors';

export const SwapTokensContent = () => {
  const ctx = useContext(WalletCtx);
  assert(ctx, `Wallet context wasn't initialized`);
  const { handlePayAmountChange, handleReceiveAmountChange } = useCalculatePrice();
  const dispatch = useAppDispatch();

  const youPay = useAppSelector(({ app }) => app.youPay);
  const youReceive = useAppSelector(({ app }) => app.youReceive);

  const youPayToken = useAppSelector(({ app }) => {
    const tokens = app.tokenListMap[app.selectedChain].tokens;
    const tokenAddress = app.tokenListMap[app.selectedChain].youPayToken;
    return tokens[tokenAddress];
  });
  const youReceiveToken = useAppSelector(({ app }) => {
    const tokens = app.tokenListMap[app.selectedChain].tokens;
    const tokenAddress = app.tokenListMap[app.selectedChain].youReceiveToken;
    return tokens[tokenAddress];
  });
  assert(youPayToken && youReceiveToken, 'Tokens should be defined');

  const chain = useAppSelector(({ app }) => app.selectedChain);
  const { data: tokenBalances, isLoading: balancesIsLoading } = useTokenBalances(ctx?.account ?? '', chain);
  const tokenBalancesArray = balancesObjectToArray(tokenBalances);
  const { data: tokenPrices } = useTokenPrices(tokenBalancesArray, chain);
  const { data: tokenAllowances } = useTokenAllowances(ctx?.account ?? '', chain);
  const youPayTokenBalanceInfo = getTokenBalanceInfo(tokenBalances, tokenPrices, youPayToken.address);
  const youReceiveTokenBalanceInfo = getTokenBalanceInfo(tokenBalances, tokenPrices, youReceiveToken.address);

  const isInsufficientBalance =
    tokenAllowances && tokenBalances
      ? BigNumber(youPay.amount).isGreaterThan(tokenBalances[youPayToken.address] ?? Infinity)
      : false;

  const isInsufficientAllowance = tokenAllowances
    ? BigNumber(youPay.amount).isGreaterThan(tokenAllowances[youPayToken.address] ?? Infinity)
    : false;

  const isTokensTheSame = youPayToken.address === youReceiveToken.address;

  const inputError = isInsufficientBalance
    ? InputError.InsufficientBalance
    : isInsufficientAllowance
    ? InputError.InsufficientAllowance
    : isTokensTheSame
    ? InputError.TokensTheSame
    : undefined;

  const youPayOnChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const amount = convertInputStringToNumber(event.target.value);
    handlePayAmountChange(amount);
  };

  const youReceiveOnChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const amount = convertInputStringToNumber(event.target.value);
    handleReceiveAmountChange(amount);
  };

  const maxButtonOnClick = () => {
    dispatch(setPay({ amount: tokenBalances?.[youPayToken.address] ?? '' }));
  };

  const tokensDataIsLoading = balancesIsLoading && ctx?.account;

  return (
    <Grid container alignItems="center">
      <SwapTokensHeadLine ctx={ctx} />

      <Grid item container xs={12} marginBottom={1} marginTop={3}>
        <Grid item xs={4} height={21} display={'flex'} alignItems="center">
          <Clarification
            title={'You Pay'}
            variant={'subtitle1'}
            description={'Amount in tokens you will spend to receive desired token'}
          />
        </Grid>
        <Grid item xs={8} display={'flex'} justifyContent={'end'} alignItems={'center'}>
          {tokensDataIsLoading && <Skeleton variant={'rectangular'} width={120} height={21} />}
          {!tokensDataIsLoading && (
            <Box display={'flex'} alignItems={'center'} gap={1}>
              {youPayTokenBalanceInfo.balance && (
                <Typography component="span">{`${youPayTokenBalanceInfo.balance?.toFixed(
                  youPayTokenBalanceInfo.precision ?? 5
                )} ${youPayToken.symbol}`}</Typography>
              )}
              {youPayTokenBalanceInfo.usdBalance && (
                <Typography component="span">{` ($${youPayTokenBalanceInfo.usdBalance.toFixed(2)})`}</Typography>
              )}
              {youPayTokenBalanceInfo.balance && <AccountBalanceWalletOutlinedIcon fontSize={'small'} />}
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} marginBottom={2}>
        <AssetInput
          search={WidgetScreen.SearchPayToken}
          token={youPayToken}
          inputState={youPay}
          onChange={youPayOnChange}
          error={inputError ? inputErrors[inputError] : undefined}
          allowanceStatus={isInsufficientAllowance ? 'needed' : undefined}
          maxButtonOnClick={maxButtonOnClick}
        />
      </Grid>

      <FlipTokensButton />

      <Grid item container xs={12} marginBottom={1} marginTop={2}>
        <Grid item xs={4} height={21} display={'flex'} alignItems="center">
          <Clarification
            title={'You Receive'}
            variant={'subtitle1'}
            description={'Amount of token you will receive'}
            style={{ whiteSpace: 'nowrap' }}
          />
        </Grid>
        <Grid item xs={8} display={'flex'} justifyContent={'end'} alignItems={'center'}>
          {tokensDataIsLoading && <Skeleton variant={'rectangular'} width={120} height={21} />}
          {!tokensDataIsLoading && (
            <Box display={'flex'} alignItems={'center'} gap={1}>
              {youReceiveTokenBalanceInfo.balance && (
                <Typography component="span">{`${youReceiveTokenBalanceInfo.balance?.toFixed(
                  youReceiveTokenBalanceInfo.precision ?? 5
                )} ${youReceiveToken.symbol}`}</Typography>
              )}

              {youReceiveTokenBalanceInfo.balance && <AccountBalanceWalletOutlinedIcon fontSize={'small'} />}
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <AssetInput
          search={WidgetScreen.SearchReceiveToken}
          token={youReceiveToken}
          inputState={youReceive}
          onChange={youReceiveOnChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TransactionInfo />
      </Grid>

      <Grid item xs={12} marginBottom={2} marginTop={2}>
        <BuyTokenButton isInsufficientBalance={isInsufficientBalance} />
      </Grid>
    </Grid>
  );
};

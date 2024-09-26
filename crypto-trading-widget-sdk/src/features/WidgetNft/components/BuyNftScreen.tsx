import React, { useCallback, useContext, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TransactionResponse } from '@ethersproject/providers';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import toast from 'react-hot-toast';
import { assert } from 'ts-essentials';
import { useQueryClient } from '@tanstack/react-query';
import { Clarification } from 'components/Clarification/Clarification';
import { Chain } from 'utils/chains';
import { ContainedButton } from 'components/Buttons/ContainedButton';
import { useAppDispatch, useAppSelector } from 'redux/hooks/reduxHooks';
import { WalletCtxInterface } from 'context/WalletContext';
import { useCreateSwapNftTx } from 'hooks/useCreateSwapNftTx';
import { useCreateSwapAndTransferNftTx } from 'hooks/useCreateSwapAndTransferNftTx';
import { NftTransactionSummary } from './NftTransactionSummary';
import { useNftOrderPriceRoute } from 'hooks/useNftOrderPriceRoute';
import { useTokenList } from 'hooks/useTokenList';
import { NftWidgetScreen, setNftWidgetScreen } from 'redux/nftWidgetSlice';
import { OngoingTransactionsCtx, TransactionStatus, TransactionType } from 'context/OngoingTransactionsContext';
import { SigningStatus, TransactionSigningStatusScreen } from 'components/TransactionSigningStatusScreen';
import { BuyNftScreenHeadLine } from './BuyNftScreenHeadLine';

import { toasterMessages } from 'features/Widget/ToasterAlerts/utils';
import { SelectTokenButton } from './SelectTokenButton/SelectTokenButton';
import { useIsInsufficientBalance } from '../hooks/useIsInsufficientBalance';
import { useIsInsufficientAllowance } from '../hooks/useIsInsufficientAllowance';
import { nftWidgetTooltips } from '../tooltips';
import { useTheme } from '@mui/material/styles';
import { formatUnits } from '@ethersproject/units';
import { TokenImage } from '../../../components/TokenImage';
import { CustomToast } from 'features/Widget/ToasterAlerts/components/CustomToast';

const getDescriptionMessage = (txStatus: SigningStatus): string => {
  if (txStatus === SigningStatus.Confirmation) {
    return 'Please confirm the transaction on your wallet to purchase NFT.';
  } else if (txStatus === SigningStatus.Submitted) {
    return 'The transaction is submitted to the blockchain and is currently being processed.';
  } else if (txStatus === SigningStatus.Rejected) {
    return 'The transaction was rejected.';
  }
  return '';
};

interface BuyNftScreenProps {
  ctx: WalletCtxInterface;
  order: NFTOrderFromAPI;
}

const SUCCESS_NOTIFICATION_LIFETIME = 4000;
export const BuyNftScreen: React.FC<BuyNftScreenProps> = ({ order, ctx }) => {
  const theme = useTheme();
  const { pushTransaction, ongoingTransactions } = useContext(OngoingTransactionsCtx);
  const chain = order.chainId as Chain;
  const dispatch = useAppDispatch();
  const { data: tokenList } = useTokenList(chain);
  const takerTokenAddress = useAppSelector(state => state.nftWidget.takerTokenAddress);
  const [txStatus, setTxStatus] = useState(SigningStatus.Idle);

  const isSimpleSwap = order.takerAsset === takerTokenAddress;
  const queryClient = useQueryClient();
  const token = tokenList?.[takerTokenAddress];

  const {
    data: priceRoute,
    isLoading: priceRouteIsLoading,
    isError: isPriceRouteError,
    error: priceRouteError,
  } = useNftOrderPriceRoute({
    library: ctx.library,
    chain,
    account: ctx.account,
    order,
    destToken: tokenList?.[order.takerAsset],
    srcToken: tokenList?.[takerTokenAddress],
  });

  const swapOptions = useMemo(
    () => ({
      onSuccess: (data: TransactionResponse) => {
        setTxStatus(SigningStatus.Submitted);
        setTimeout(() => dispatch(setNftWidgetScreen(NftWidgetScreen.DEFAULT)), SUCCESS_NOTIFICATION_LIFETIME);
        pushTransaction(data, chain, {
          transactionType: TransactionType.NftPurchase,
          order: order,
        });
      },
      onMutate: () => setTxStatus(SigningStatus.Confirmation),
      onError: (e: Error) => {
        setTxStatus(SigningStatus.Rejected);
        queryClient.refetchQueries(['nftOrder', order.orderHash, chain]).then();
        if (!e.message.includes('cannot estimate gas')) {
          toast.error(
            <CustomToast
              title={toasterMessages.nftPurchaseTx.rejected.title}
              description={toasterMessages.nftPurchaseTx.rejected.description}
            />
          );
        }
      },
    }),
    []
  );

  const swapNftMutation = useCreateSwapNftTx({ account: ctx.account, orderHash: order.orderHash }, swapOptions);
  const swapAndTransferMutation = useCreateSwapAndTransferNftTx(
    { account: ctx.account, orderHash: order.orderHash },
    swapOptions
  );

  const signTransaction = useCallback(async () => {
    assert(ctx.library && tokenList && ctx.account, 'Missing dependencies for transaction signing');

    const orderTakerToken = tokenList[order.takerAsset];

    if (!orderTakerToken) {
      console.error('orderTakerToken token not found');
      return;
    }

    if (isSimpleSwap) {
      swapNftMutation.mutate({
        library: ctx.library,
        account: ctx.account,
        chain,
        order,
        srcToken: orderTakerToken,
      });
    } else if (priceRoute) {
      swapAndTransferMutation.mutate({
        library: ctx.library,
        account: ctx.account,
        chain,
        order,
        priceRoute,
      });
    }
  }, [ctx.account, chain, order, priceRoute, tokenList]);

  const buttonOptions = useMemo(() => {
    if (!ctx.account) {
      return { label: 'Connect Wallet', action: () => dispatch(setNftWidgetScreen(NftWidgetScreen.CONNECT_WALLET)) };
    } else if (ctx.walletChain !== chain) {
      return { label: 'Switch chain', action: () => ctx.selectChain(chain) };
    } else {
      return { label: 'Buy', action: signTransaction };
    }
  }, [ctx.account, ctx.walletChain, chain, signTransaction]);

  const isInsufficientAllowance = useIsInsufficientAllowance({
    account: ctx.account ?? '',
    chain,
    amount: priceRoute ? priceRoute.srcAmount : order.takerAmount,
    token: tokenList?.[takerTokenAddress],
  });

  const isInsufficientBalance = useIsInsufficientBalance({
    account: ctx.account ?? '',
    chain,
    takerTokenAddress,
    order,
    tokenList,
    priceRoute,
  });
  const onDismiss = useCallback(() => {
    dispatch(setNftWidgetScreen(NftWidgetScreen.DEFAULT));
    setTxStatus(SigningStatus.Idle);
  }, []);

  if (txStatus !== SigningStatus.Idle) {
    return (
      <TransactionSigningStatusScreen
        description={getDescriptionMessage(txStatus)}
        status={txStatus}
        tryAgain={signTransaction}
        onDismiss={onDismiss}
      />
    );
  }

  const transactionSummaryIsLoading =
    (priceRouteIsLoading && !isSimpleSwap) || (isInsufficientBalance === undefined && !!ctx.account);
  const assetUnlockingIsLoading =
    ongoingTransactions.filter(
      tx =>
        tx.transactionType === TransactionType.Approve &&
        tx.status === TransactionStatus.PENDING &&
        tx.tokenAddress.toLowerCase() === takerTokenAddress.toLowerCase()
    ).length > 0;

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <BuyNftScreenHeadLine ctx={ctx} chain={chain} />
      <Paper variant="info">
        <Clarification color={theme.palette.text.secondary} {...nftWidgetTooltips.price} />
        {tokenList && (
          <Box display="flex" mt={1}>
            <TokenImage src={tokenList[order.takerAsset]?.logoURI} width={20} height={20} alt={'Order token'} />
            <Typography ml={1} variant={'subtitle1'}>
              {tokenList[order.takerAsset] ? formatUnits(order.takerAmount, tokenList[order.takerAsset].decimals) : ''}
            </Typography>
          </Box>
        )}
      </Paper>
      <Box mb={4} mt={1}>
        <Clarification variant={'subtitle1'} {...nftWidgetTooltips.paymentToken} />
        {tokenList && token && (
          <Box mt={1}>
            <SelectTokenButton
              token={token}
              isInsufficientAllowance={isInsufficientAllowance}
              isInsufficientBalance={isInsufficientBalance}
              customError={
                priceRouteError
                  ? {
                      severity: 'error',
                      message: priceRouteError.message
                        ? priceRouteError.message.replaceAll('_', ' ').toLowerCase()
                        : 'Something went wrong',
                    }
                  : undefined
              }
            />
          </Box>
        )}
      </Box>
      <NftTransactionSummary
        order={order}
        chain={chain}
        priceRoute={priceRoute}
        isLoading={transactionSummaryIsLoading}
      />
      <Box flexGrow={1} />
      {isInsufficientAllowance && !isInsufficientBalance && tokenList && token ? (
        <ContainedButton
          fullWidth
          onClick={() => dispatch(setNftWidgetScreen(NftWidgetScreen.ALLOWANCE_REQUEST))}
          customIsLoading={assetUnlockingIsLoading}
        >{`Unlock ${token.symbol}`}</ContainedButton>
      ) : (
        <ContainedButton
          fullWidth
          onClick={buttonOptions.action}
          disabled={(isInsufficientBalance || isPriceRouteError) && ctx.walletChain === chain}
          customIsLoading={
            swapNftMutation.isLoading || swapAndTransferMutation.isLoading || !tokenList || transactionSummaryIsLoading
          }
        >
          {buttonOptions.label}
        </ContainedButton>
      )}
    </Box>
  );
};

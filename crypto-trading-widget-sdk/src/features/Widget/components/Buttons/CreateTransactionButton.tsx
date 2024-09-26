import Web3 from 'web3';
import React, { useContext } from 'react';
import { WalletCtx } from '../../../../context/WalletContext';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks/reduxHooks';
import { Chain, chainConfigs } from '../../../../utils/chains';
import { setCurrentScreen, setSwapTxInProgress } from '../../../../redux/appSlice';
import { WidgetScreen } from '../../../../redux/app.interface';
import { useTokenAllowances } from '../../../../hooks/useTokenAllowances';
import { useTokenBalances } from '../../../../hooks/useTokenBalances';
import { ContainedButton } from '../../../../components/Buttons/ContainedButton';
import toast from 'react-hot-toast';
import { TransactionReceipt } from '@ethersproject/providers';
import { CustomToast } from 'features/Widget/ToasterAlerts/components/CustomToast';
import { toasterMessages } from 'features/Widget/ToasterAlerts/utils';
import { assert } from 'ts-essentials';

// Toast with create swap transaction messages
const getToast = (status: 'success' | 'error' | 'loading', txInfo?: { hash: string; explorerUrl: string }) => {
  return (
    <CustomToast
      title={toasterMessages.createSwap[status].title}
      description={toasterMessages.createSwap[status].description}
      txHash={txInfo?.hash}
      explorerUrl={txInfo ? txInfo.explorerUrl : undefined}
    />
  );
};

export const CreateTransactionButton = () => {
  const ctx = useContext(WalletCtx);
  const dispatch = useAppDispatch();
  const transaction = useAppSelector(({ app }) => app.transaction);
  const youPayOptions = useAppSelector(({ app }) => app.youPay);
  const youReceiveOptions = useAppSelector(({ app }) => app.youReceive);
  const tokenListMap = useAppSelector(({ app }) => app.tokenListMap);
  const selectedChain = useAppSelector(({ app }) => app.selectedChain);

  const confirmTxButtonDisabled = youPayOptions.loading || youReceiveOptions.loading;
  const { refetch: refetchAllowances } = useTokenAllowances(ctx?.account ?? '', selectedChain);
  const { refetch: refetchBalances } = useTokenBalances(ctx?.account ?? '', selectedChain);

  const handleSwapCreation = async (chain?: Chain) => {
    assert(chain, 'chain is undefined');
    if (!transaction || !ctx?.library) {
      console.error('transaction or web3 library is undefined');
      return;
    }

    const txParams = {
      data: transaction.data,
      from: transaction.from,
      to: transaction.to,
      chainId: transaction.chainId,
      gasLimit: Web3.utils.toHex(transaction.gas),
      value: Web3.utils.toHex(transaction.value),
      maxFeePerGas: Web3.utils.toHex(transaction.maxFeePerGas),
      maxPriorityFeePerGas: Web3.utils.toHex(transaction.maxFeePerGas),
    };

    try {
      const signer = ctx.library.getSigner(transaction.from);
      const tx = await signer.sendTransaction(txParams);

      dispatch(setCurrentScreen(WidgetScreen.Default));
      dispatch(setSwapTxInProgress(true));

      const explorerUrl = chainConfigs[chain].explorerUrl;

      await toast.promise(tx.wait(), {
        loading: getToast('loading', { hash: tx.hash, explorerUrl }),
        success: (receipt: TransactionReceipt) => getToast('success', { hash: receipt.transactionHash, explorerUrl }),
        error: getToast('error'),
      });
    } catch (e) {
      console.error(e);
      toast.error(getToast('error'));
    } finally {
      dispatch(setSwapTxInProgress(false));
      refetchBalances();
      refetchAllowances();
    }
  };

  if (!ctx?.walletChain) {
    return (
      <ContainedButton fullWidth onClick={() => dispatch(setCurrentScreen(WidgetScreen.ConnectWallet))}>
        {'Connect Wallet'}
      </ContainedButton>
    );
  }
  return (
    <>
      {ctx?.walletChain && (
        <ContainedButton
          fullWidth
          onClick={() => handleSwapCreation(ctx?.walletChain)}
          disabled={confirmTxButtonDisabled}
        >
          {`Buy ${tokenListMap[ctx.walletChain].tokens[tokenListMap[ctx.walletChain].youReceiveToken].symbol}`}
        </ContainedButton>
      )}
    </>
  );
};

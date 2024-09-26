import style from './SwapModal.module.css';
import { approve } from '@/common/web3/Web3Manager';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import CoinsImages from '@/components/CoinsImages/CoinsImages';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { ToFixed } from '@/helpers/ToFixed';
import useMultilingual from '@/hooks/useMultilingual';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useWeb3React } from '@web3-react/core';
import { analytics, getTokensUnlockAnalyticsData } from 'analytics/analytics';
import React, { useState } from 'react';
import { TransactionReceipt } from 'ethereum-types';

enum LoadingButtonType {
  TEMPORARY_APPROVE = 'TEMPORARY_APPROVE',
  PERMANENT_APPROVE = 'PERMANENT_APPROVE',
}

interface ApproveSwapModalProps {
  setActive: (a: boolean) => void;
  approveForAddress: string;
  type: string;
  amountInWei: string;
  addApprove: (address: string, txHash: string) => void;
  removeApprove: (address: string) => void;
}

export const ApproveSwapLimitModal = ({
  setActive,
  approveForAddress,
  type,
  amountInWei,
  addApprove,
  removeApprove,
}: ApproveSwapModalProps) => {
  const { t, tc } = useMultilingual('swapModal');

  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingButtonType, setLoadingButtonType] = useState<LoadingButtonType>(LoadingButtonType.TEMPORARY_APPROVE);
  const { account: clientAddress, provider } = useWeb3React();

  const handleApprove = async (permanent: boolean) => {
    setIsLoading(true);
    setLoadingButtonType(permanent ? LoadingButtonType.PERMANENT_APPROVE : LoadingButtonType.TEMPORARY_APPROVE);
    const typeProps = { tokenA: tokenA.symbol, tokenB: tokenB.symbol };
    const options = { type, clientAddress, props: typeProps, chainId };
    const analyticsData = getTokensUnlockAnalyticsData(options);

    analytics('CE token_unlock_prompt_confirm', null, null, analyticsData);
    await createApproveTx(permanent, analyticsData);
  };

  const createApproveTx = async (permanent: boolean, analyticsData: Record<string, unknown>) => {
    let tx;
    try {
      const tokenAddress = tokenA.address;
      const tradeInfo = { clientAddress, permanent, amountInWei, approveForAddress, chainId, tokenAddress };
      tx = await approve(provider, tradeInfo);
      callbackOnSendApprove(tx.hash);
      analytics('CE token_unlock_wallet_confirm', null, null, analyticsData);
      const receipt = await tx.wait();
      onSuccessApprove(receipt);
    } catch (e) {
      onErrorApprove(tx?.hash);
    }
  };

  const callbackOnSendApprove = (hash: string) => {
    setIsLoading(false);
    Notify({ state: NotifyEnum.WARNING, message: t('approveCreated'), link: { hash, chainId } });
    setActive(false);
    addApprove(tokenA?.address, hash);
  };

  const onSuccessApprove = ({ transactionHash: hash }: TransactionReceipt) => {
    Notify({ state: NotifyEnum.SUCCESS, message: t('approveConfirmed'), link: { hash, chainId } });
    removeApprove(tokenA?.address);
  };

  const onErrorApprove = hash => {
    setIsLoading(false);
    Notify({ state: NotifyEnum.ERROR, message: t('approveCancelled'), link: { hash, chainId } });
    removeApprove(tokenA?.address);
  };

  return (
    <div className={style.wrapperModal}>
      <div className={style.titleModal}>
        <CoinsImages symbol={tokenA?.symbol} />
        {tc('approveTitle')([tokenA?.symbol])}
      </div>
      <p className={style.descriptionModal}>
        {tc('approveDescription')([
          ToFixed(convertFromWei(+amountInWei, tokenA?.decimals), tokenA?.symbol, 4),
          tokenA?.symbol,
        ])}
      </p>
      <div className={style.actionsModal}>
        <ButtonSimple
          isLoading={isLoading && loadingButtonType === LoadingButtonType.PERMANENT_APPROVE}
          color="white"
          onClick={() => handleApprove(true)}
          disabled={isLoading && loadingButtonType === LoadingButtonType.PERMANENT_APPROVE}
        >
          {t('firstApproveButton')}
        </ButtonSimple>
        <ButtonSimple
          isLoading={isLoading && loadingButtonType === LoadingButtonType.TEMPORARY_APPROVE}
          onClick={() => handleApprove(false)}
          disabled={isLoading && loadingButtonType === LoadingButtonType.TEMPORARY_APPROVE}
        >
          {t('secondApproveButton')}
        </ButtonSimple>
      </div>
    </div>
  );
};

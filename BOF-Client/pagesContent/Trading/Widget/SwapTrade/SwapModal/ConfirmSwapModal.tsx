import { chains } from 'connection/chainConfig';
import { createTransaction } from '@/common/web3/Web3Manager';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import Clarification from '@/components/Clarification/Clarification';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import useMultilingual from '@/hooks/useMultilingual';
import { updateBalances } from '@/redux/appSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { addSwap, updateSwapByHash, deleteSwapByHash } from '@/redux/swapSlice';
import { BigNumber } from '@0x/utils';
import { useWeb3React } from '@web3-react/core';
import createSwap from 'API/swap/create-swap';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import style from './SwapModal.module.css';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { PriceRouteDto } from '@/interfaces/SwapPriceResponse.interface';

interface ConfirmSwapModalProps {
  setActive: (a: boolean) => void;
  active: boolean;
  onConfirm: () => void;
}

export const ConfirmSwapModal = ({ setActive, active, onConfirm }: ConfirmSwapModalProps) => {
  const { t } = useMultilingual('swapModal');
  const { c } = useMultilingual('swapPopupTooltip');

  const dispatch = useAppDispatch();
  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);
  const priceRoute = useAppSelector(({ swap }) => swap.priceRoute);
  const swapSettings = useAppSelector(({ swap }) => swap.swapSettings);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account: clientAddress, provider } = useWeb3React();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    //check how many time this effect invoking
    return () => {
      setIsLoading(false);
      setError('');
    };
  }, [active]);

  const getSwapTxObject = async (priceRoute: PriceRouteDto, clientAddress: string) => {
    // TODO: update this legacy calculations
    const [destAmount, srcAmount] =
      priceRoute.side === 'SELL'
        ? [Math.floor(Number(priceRoute.destAmount) * 0.99).toString(), priceRoute.srcAmount]
        : [priceRoute.destAmount, Math.floor(Number(priceRoute.srcAmount) * 1.01).toString()];

    return createSwap(
      clientAddress,
      new BigNumber(Number(destAmount)).toString(),
      new BigNumber(Number(srcAmount)).toString(),
      priceRoute,
      chains[chainId].eip1559,
      swapSettings.partnerAddress,
      swapSettings.feePercentage
    );
  };

  const handleConfirm = async () => {
    if (priceRoute && tokenA && tokenB && clientAddress) {
      setIsLoading(true);

      let tx;
      try {
        const eip1559 = chains[chainId].eip1559;
        const txObject = await getSwapTxObject(priceRoute, clientAddress);
        if (txObject.error) {
          setError('Failed to get transaction params');
          return;
        }
        tx = await createTransaction(provider, txObject, eip1559);
        callbackOnSend(tx.hash, priceRoute);
        const receipt = await tx.wait();
        onSuccess(receipt);
      } catch (error: unknown) {
        onError(tx?.hash, error);
      }
    }
  };

  const callbackOnSend = (hash: string, priceRoute: PriceRouteDto) => {
    setIsLoading(false);
    Notify({ state: NotifyEnum.WARNING, message: t('swapCreated'), link: { chainId, hash } });
    setActive(false);
    dispatch(addSwap(priceRoute, hash));
  };

  const onSuccess = (receipt: TransactionReceipt) => {
    const hash = receipt.transactionHash;
    dispatch(
      updateSwapByHash(hash, receipt?.gasUsed?.toString() ?? '0', receipt?.effectiveGasPrice?.toString() ?? '0')
    );
    dispatch(updateBalances());
    Notify({ state: NotifyEnum.SUCCESS, message: t('swapConfirmed'), link: { hash, chainId } });
    onConfirm();
  };

  const onError = (hash: string, error: any) => {
    setIsLoading(false);
    Notify({ state: NotifyEnum.ERROR, message: t('swapRejected'), link: { hash, chainId } });

    if (error?.code === 4001) {
      // analytics('CE swap_reject', null, null, analyticsData);
    } else {
      const errorHash = JSON.parse(JSON.stringify(error))?.receipt?.transactionHash;
      if (errorHash) {
        dispatch(deleteSwapByHash(errorHash));
      }
      // analytics('CE swap_error', error, errorHash, analyticsData);
    }
  };

  return (
    <>
      <div className={style.titleModal}>{t('title')}</div>
      <p className={style.subTitleModal}>{t('description')}</p>
      <h5 className={style.sectionTitleModal}>{t('sectionTitleModal')}</h5>
      <div className={style.sectionModal}>
        <ul className={style.listModal}>
          <li className={style.listItemModal}>
            <div className={style.itemNameModal}>
              <span className={style.nameModal}>{t('slippage')}</span>
              <Clarification helperText={c('slippage')} />
            </div>
            <span className={style.itemValueModal}>
              <NumberFormat thousandSeparator displayType="text" value={1} suffix="%" />
            </span>
          </li>
          <li className={style.listItemModal}>
            <div className={style.itemNameModal}>
              <span className={style.nameModal}>{t('systemFee')}</span>
              <Clarification helperText={c('fees')} />
            </div>
            <span className={style.itemValueModal}>
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                displayType="text"
                value={(Number(priceRoute?.destUSD) * Number(swapSettings?.feePercentage)) / 10000}
                prefix="~$"
              />
            </span>
          </li>
          <li className={style.listItemModal}>
            <div className={style.itemNameModal}>
              <span className={style.nameModal}>{t('gas')}</span>
              <Clarification helperText={c('estimate')} />
            </div>
            <span className={style.itemValueModal}>
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                displayType="text"
                value={priceRoute?.gasCostUSD}
                prefix="~$"
              />
            </span>
          </li>
        </ul>
      </div>
      <div>
        <ButtonSimple isLoading={isLoading} disabled={!!error || isLoading} onClick={handleConfirm}>
          {t('getIt')}
        </ButtonSimple>
      </div>
      {error && <p className={style.errorModal}>{error}</p>}
    </>
  );
};

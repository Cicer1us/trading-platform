import React, { useEffect, useState } from 'react';
import style from './LimitModal.module.css';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import Clarification from '@/components/Clarification/Clarification';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import { ToFixed } from '@/helpers/ToFixed';
import useMultilingual from '@/hooks/useMultilingual';
import { signLimitOrderObj } from '@/redux/helpers/signLimitOrder';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { updateLimitOrders } from '@/redux/limitSlice';
import { useWeb3React } from '@web3-react/core';
import { analytics, getLimitAnalyticsData } from 'analytics/analytics';
import createLimit from 'API/limit/createLimit';

interface ConfirmSwapModalProps {
  setActive: (a: boolean) => void;
  active: boolean;
  valueFirst: number;
  valueSecond: number;
  valuePeriod: number;
  onConfirm: () => void;
}

export const ConfirmLimitModal = ({
  setActive,
  active,
  valueFirst,
  valueSecond,
  valuePeriod,
  onConfirm,
}: ConfirmSwapModalProps) => {
  const { t } = useMultilingual('limitModal');
  const { c } = useMultilingual('limitTransactionSummaryTooltip');

  const dispatch = useAppDispatch();
  const chainId = useAppSelector(({ app }) => app.chainId);
  const tokenA = useAppSelector(({ widget }) => widget.selectedTokenA);
  const tokenB = useAppSelector(({ widget }) => widget.selectedTokenB);
  const feePercentage = useAppSelector(({ limit }) => limit.settings.feePercentage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account: clientAddress, provider } = useWeb3React();
  const [error, setError] = useState<string>('');

  useEffect(
    () => () => {
      setError('');
      setIsLoading(false);
    },
    [active]
  );

  const handleConfirm = async () => {
    setIsLoading(true);

    const options = { type: 'Limit', clientAddress, tokenA: tokenA.symbol, tokenB: tokenB.symbol, chainId };
    const analyticsData = getLimitAnalyticsData(options);
    analytics('CE limit_receipt_confirm', null, null, analyticsData);

    const signedOrder = await signLimitOrderObj(valueFirst, valueSecond, +valuePeriod, provider, chainId);
    if (signedOrder) {
      await handleSignedOrder(signedOrder, analyticsData);
    } else {
      Notify({ state: NotifyEnum.ERROR, message: t('signingRejected') });
      setIsLoading(false);
    }
  };

  const handleSignedOrder = async (signedOrder, analyticsData) => {
    analytics('CE limit_wallet_confirm', null, null, analyticsData);
    const orderWasCreated = await createLimit(signedOrder, clientAddress);

    if (!orderWasCreated) {
      setError('Oops. Something went wrong, try again...');
      setIsLoading(false);
    } else {
      setActive(false);
      setIsLoading(false);
      Notify({ state: NotifyEnum.SUCCESS, message: t('limitOrderCreated') });
      dispatch(updateLimitOrders());
      onConfirm();
    }
  };

  return (
    <>
      <div className={style.wrapperModal}>
        <div className={style.titleModal}>{t('title')}</div>
        <p className={style.subTitleModal}>{t('description')}</p>
        <div className={style.sectionModal}>
          <ul className={style.listModal}>
            <li className={style.listItemModal}>
              <div className={style.itemNameModal}>
                <span className={style.nameModal}>{t('fees')}</span>
                <Clarification helperText={c('fees')} />
              </div>
              <span className={style.itemValueModal}>{feePercentage}%</span>
            </li>
            <li className={style.listItemModal}>
              <div className={style.itemNameModal}>
                <span className={style.nameModal}>{t('receive')}</span>
                <Clarification helperText={c('receive')} />
              </div>
              <span className={style.itemValueModal}>
                <p>{`${ToFixed(valueSecond, tokenB?.symbol, 5)} ${tokenB?.symbol}`}</p>
              </span>
            </li>
          </ul>
        </div>
        <div className={style.actions}>
          <ButtonSimple isLoading={isLoading} disabled={isLoading} onClick={handleConfirm}>
            {t('getIt')}
          </ButtonSimple>
        </div>
      </div>
      {error && <p className={style.errorModal}>{error}</p>}
    </>
  );
};

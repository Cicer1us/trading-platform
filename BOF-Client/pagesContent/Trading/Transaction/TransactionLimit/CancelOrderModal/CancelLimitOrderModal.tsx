import React, { useEffect, useState } from 'react';
import style from './CancelLimitOrderModal.module.css';
import Clarification from '@/components/Clarification/Clarification';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/reduxHooks';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import { setLimitCancellingStatusById, updateLimitOrder } from '@/redux/limitSlice';
import { LimitOrder, LimitOrderStatus } from '@/interfaces/Limit.interface';
import useMultilingual from '@/hooks/useMultilingual';
import { useWeb3React } from '@web3-react/core';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { customCancel } from '@/common/web3/Web3Manager';
import { longListSelector } from '@/redux/widgetSlice';
import NumberFormat from 'react-number-format';

interface CancelLimitOrderModalProps {
  active: boolean;
  order: LimitOrder;
  setActive: (a: boolean) => void;
}

const CancelLimitOrderModal: React.FC<CancelLimitOrderModalProps> = ({ active, setActive, order }): JSX.Element => {
  const { t } = useMultilingual('limitCancelOrderModal');
  const { c } = useMultilingual('limitWidgetTooltip');

  const dispatch = useAppDispatch();
  const tokens = useAppSelector(longListSelector);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { provider, chainId } = useWeb3React();

  const tokenToSend = tokens.find(token => token.address === order?.raw.makerToken);
  const tokenToReceive = tokens.find(token => token.address === order?.raw.takerToken);
  const tokenToSendAmount = convertFromWei(Number(order?.raw.makerAmount), tokenToSend?.decimals);
  const tokenToReceiveAmount = convertFromWei(Number(order?.raw.takerAmount), tokenToReceive?.decimals);

  useEffect(() => () => setIsLoading(false), [active]);

  const onCancel = async () => {
    setIsLoading(true);
    let tx;
    try {
      tx = await customCancel(provider, chainId, order.raw);
      callbackOnSendCancel(tx.hash);
      const receipt = await tx.wait();
      onSuccessCancel(receipt);
    } catch (e) {
      onErrorCancel(tx?.hash);
    }
  };

  const callbackOnSendCancel = (hash: string) => {
    setIsLoading(false);
    Notify({ state: NotifyEnum.WARNING, message: t('cancelLimitOrderCreated'), link: { chainId, hash } });
    dispatch(setLimitCancellingStatusById(order.raw.id, hash));
    setActive(false);
  };

  const onSuccessCancel = ({ transactionHash: hash }) => {
    Notify({ state: NotifyEnum.SUCCESS, message: t('cancelLimitOrderCancelled'), link: { chainId, hash } });
    dispatch(updateLimitOrder(order.raw.id, LimitOrderStatus.CANCELLED));
  };

  const onErrorCancel = hash => {
    setIsLoading(false);
    Notify({ state: NotifyEnum.ERROR, message: t('cancelLimitOrderRejected'), link: { chainId, hash } });
  };

  return (
    <div className={style.wrapperModal}>
      <h3 className={style.titleModal}>{t('title')}</h3>
      <p className={style.subTitleModal}>{t('description')}</p>
      <div className={style.sectionModal}>
        <ul className={style.listModal}>
          <li className={style.listItemModal}>
            <div className={style.itemNameModal}>
              <span className={style.nameModal}>{t('pay')}</span>
              <Clarification helperText={c('pay')} />
            </div>
            <span className={style.itemValueModal}>
              <NumberFormat thousandSeparator displayType="text" value={tokenToSendAmount} decimalScale={4} />{' '}
              {tokenToSend?.symbol}
            </span>
          </li>

          <li className={style.listItemModal}>
            <div className={style.itemNameModal}>
              <span className={style.nameModal}>{t('receive')}</span>
              <Clarification helperText={c('receive')} />
            </div>
            <span className={style.itemValueModal}>
              <NumberFormat thousandSeparator displayType="text" value={tokenToReceiveAmount} decimalScale={4} />{' '}
              {tokenToReceive?.symbol}
            </span>
          </li>
        </ul>
      </div>
      <div className={style.actions}>
        <ButtonSimple isLoading={isLoading} disabled={isLoading} onClick={onCancel}>
          {t('cancel')}
        </ButtonSimple>

        <ButtonSimple color="white" onClick={() => setActive(false)}>
          {t('leave')}
        </ButtonSimple>
      </div>
    </div>
  );
};

export default CancelLimitOrderModal;

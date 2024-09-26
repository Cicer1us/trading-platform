import React, { useEffect, useState } from 'react';
import style from './LeverageTrade.module.css';
import LeverageWidgetTabs from './LeverageWidgetTabs';
import BuySellButtonsBlock from './BuySellButtonsBlock';
import LeverageLevelInput from './LeverageLevelInput';
import OpenOrderButton from './OpenOrderButton';
import LeverageWidgetErrorBox from './LeverageWidgetErrorBox';
import TokenAmountInput from './TokenAmounInput';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { OrderType } from '@dydxprotocol/v3-client';
import TimeRageAndTriggerPriceInput from './TimeRageAndTriggerPriceInput';
import LimitPriceInput from './LimitPriceInput';
import { Alert } from '@/components/Alert/Alert';
import Modal from '@/components/Modal/Modal';
import DepositOrApprove from '../../LeverageInfo/DepositOrApprove';
import { clientManager } from '@/common/DydxClientManager';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { AllowanceStatus, setAllowance } from '@/redux/dydxDataSlice';
import useMultilingual from '@/hooks/useMultilingual';
import { chains } from 'connection/chainConfig';

const LeverageTrade: React.FC = (): JSX.Element => {
  const { account: clientAddress, chainId } = useWeb3React();
  const { t } = useMultilingual('widget');
  const dispatch = useDispatch();
  const orderType = useAppSelector(({ leverage }) => leverage.orderType);
  const equity = useAppSelector(({ dydxData }) => dydxData?.account?.equity);
  const depositTx = useAppSelector(({ dydxData }) => dydxData.depositTx);
  const [depositModalIsVisible, setDepositModalIsVisible] = useState<boolean>(false);

  useEffect(() => {
    getAllowance().then();
  }, []);

  const getAllowance = async () => {
    const usdcAllowance = await clientManager.client.eth.collateralToken.getExchangeAllowance({
      ownerAddress: clientAddress,
    });

    if (usdcAllowance && Number(usdcAllowance) > 1000) {
      dispatch(setAllowance(AllowanceStatus.Allowed));
    } else {
      dispatch(setAllowance(AllowanceStatus.NotAllowed));
    }
  };

  return (
    <>
      <LeverageWidgetTabs />
      <BuySellButtonsBlock />
      <div className={style.wrapper}>
        <TokenAmountInput />
        {orderType !== OrderType.MARKET && <LimitPriceInput />}
        {orderType === OrderType.MARKET && <LeverageLevelInput />}
        {orderType !== OrderType.MARKET && <TimeRageAndTriggerPriceInput />}
        <LeverageWidgetErrorBox />

        {!depositTx && (!equity || Number(equity) === 0) && (
          <Alert className={style.errorBoxWrapper} severity={'error'}>
            {t('depositNeeded')}
            <p className={style.alertLink} onClick={() => setDepositModalIsVisible(true)}>
              {t('makeDeposit')}
            </p>
          </Alert>
        )}

        {depositTx && Number(equity) === 0 && (
          <Alert className={style.errorBoxWrapper} severity={'info'}>
            {t('depositAlertMsg')}
            <p className={style.alertLink}>
              <a
                target={'_blank'}
                onClick={() => setDepositModalIsVisible(true)}
                href={`${chains[chainId].explorerUrl}/tx/${depositTx}`}
              >
                {'Deposit transaction'}
              </a>
            </p>
          </Alert>
        )}
      </div>
      <OpenOrderButton />

      <Modal active={depositModalIsVisible} setActive={setDepositModalIsVisible} className={style.modal}>
        <DepositOrApprove setActive={setDepositModalIsVisible} />
      </Modal>
    </>
  );
};

export default React.memo(LeverageTrade);

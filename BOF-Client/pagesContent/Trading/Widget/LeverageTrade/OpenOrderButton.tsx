import React, { useState } from 'react';
import WidgetSendButton from '../WidgetSendButton/WidgetSendButton';
import Modal from '@/components/Modal/Modal';
import LeverageModal from './LeverageModal/LeverageModal';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import { clientManager } from '@/common/DydxClientManager';
import { ApiOrder, MarketResponseObject, OrderSide, OrderType, PartialBy, TimeInForce } from '@dydxprotocol/v3-client';
import dayjs from 'dayjs';
import useMultilingual from '@/hooks/useMultilingual';
import { setLeverageOrderError, setOrderInProgress } from '@/redux/leverageSlice';
import { analytics, getLeverageAnalyticsData } from 'analytics/analytics';
import { useWeb3React } from '@web3-react/core';
import { LEVERAGE_ORDER_FEE, LIMIT_FEE } from '@/common/LeverageTradeConstants';
import { calcLiquidationPrice, formatSize } from '@/common/leverageCalculations';

const OpenOrderButton: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');

  const isBuy = useAppSelector(({ widget }) => widget.isBuy);
  const equity = useAppSelector(({ dydxData }) => Number(dydxData?.account?.equity));
  const accountLeverage = useAppSelector(({ dydxData }) => dydxData?.accountLeverage ?? 0);
  const markets = useAppSelector(({ dydxData }) => dydxData?.markets);
  const totalMaintenanceMarginRequirement = useAppSelector(
    ({ dydxData }) => dydxData.totalMaintenanceMarginRequirement
  );
  const positionToken = useAppSelector(({ leverage }) => leverage?.selectedMarket);

  const { account: clientAddress, chainId } = useWeb3React();
  const orderError = useAppSelector(({ leverage }) => leverage.orderError);
  const isLoading = useAppSelector(({ leverage }) => leverage.orderInProgress);
  const orderType = useAppSelector(({ leverage }) => leverage.orderType);
  const tokenAmount = useAppSelector(({ leverage }) => Number(leverage.tokenAmount));
  const limitPrice = useAppSelector(({ leverage }) => leverage.limitPrice);
  const timeRange = useAppSelector(({ leverage }) => Number(leverage.timeRage));
  const timeRangeUnit = useAppSelector(({ leverage }) => leverage.timeRangeUnit);
  const triggerPrice = useAppSelector(({ leverage }) => Number(leverage.triggerPrice));

  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);

  const [leverageModalIsActive, setLeverageModalIsActive] = useState<boolean>(false);

  const isAuthorized = useAppSelector(({ dydxAuth }) => {
    return dydxAuth.authIsCompleted;
  });
  const account = useAppSelector(({ dydxData }) => {
    return dydxData.account;
  });
  const selectedAsset = useAppSelector(({ leverage }) => leverage?.selectedMarket);
  const currentMarket: MarketResponseObject = markets && markets[`${selectedAsset}-USD`];
  const currentMarketPrice: number = markets && Number(currentMarket?.oraclePrice);

  const price =
    limitPrice > 0 ? String(limitPrice) : formatSize(currentMarketPrice, currentMarket.tickSize, isBuy ? 0.05 : -0.05);
  const size = formatSize(tokenAmount, currentMarket.stepSize, 0);

  const tradeIsDisabled = () => {
    if (isLoading || orderError || !isAuthorized) {
      return true;
    }

    if (!(tokenAmount > 0)) {
      return true;
    }

    if ((orderType === OrderType.LIMIT || orderType === OrderType.STOP_LIMIT) && !(limitPrice > 0)) {
      return true;
    }

    if (orderType === OrderType.STOP_LIMIT && !(triggerPrice > 0)) {
      return true;
    }

    return !(timeRange > 0);
  };

  const getAnalyticsDataOptions = () => {
    return {
      propsType: 'leverage',
      type: 'Leverage',
      clientAddress,
      positionToken,
      direction: isBuy ? OrderSide.BUY : OrderSide.SELL,
      chainId,
    };
  };

  const requestTrade = async () => {
    const newAccountLeverage = accountLeverage + (tokenAmount * currentMarketPrice) / equity;
    if (newAccountLeverage > 1) {
      const liqPrice = calcLiquidationPrice(
        currentMarket,
        equity,
        totalMaintenanceMarginRequirement,
        tokenAmount,
        isBuy,
        true
      );
      setLiquidationPrice(liqPrice);
    } else {
      setLiquidationPrice(null);
    }

    const fee = currentMarketPrice * tokenAmount * LEVERAGE_ORDER_FEE;
    setFee(fee);
    setLeverageModalIsActive(true);

    const analyticsData = getLeverageAnalyticsData(getAnalyticsDataOptions());
    analytics('CE leverage_open_position_form_submit', null, null, analyticsData);
  };

  const getTradeObject = (): PartialBy<ApiOrder, 'clientId' | 'signature'> => {
    const expiration = timeRange
      ? dayjs().add(timeRange, timeRangeUnit).toISOString()
      : dayjs().add(5, 'minute').toISOString();

    const tradeObj = {
      market: currentMarket.market,
      side: isBuy ? OrderSide.BUY : OrderSide.SELL,
      type: orderType,
      timeInForce: TimeInForce.FOK,
      postOnly: false,
      // Size of the order, in base currency (i.e. an ETH-USD position of size 1 represents 1 ETH).
      size,
      // Worst accepted price of the base asset in USD
      price,
      //The limitFee is the highest fee a user would be willing to accept on an order. This should be in decimal form (i.e. 0.1 is 10%)
      limitFee: LIMIT_FEE,
      expiration,
    };

    if (orderType === OrderType.STOP_LIMIT) {
      tradeObj['triggerPrice'] = String(triggerPrice);
    }
    if (orderType !== OrderType.MARKET) {
      tradeObj.timeInForce = TimeInForce.GTT;
    }

    return tradeObj;
  };

  const createOrderRequest = async () => {
    dispatch(setOrderInProgress(true));
    try {
      const tradeObj = getTradeObject();
      await clientManager.client.private.createOrder(tradeObj, account.positionId);
    } catch (e) {
      console.error(e);
      const res = { ...e };
      if (res?.data?.errors?.[0]?.msg) {
        dispatch(setLeverageOrderError(res.data.errors[0].msg));
      }
    }
    dispatch(setOrderInProgress(false));
  };

  const handleOrderCreation = async () => {
    dispatch(setOrderInProgress(true));
    const analyticsData = getLeverageAnalyticsData(getAnalyticsDataOptions());
    analytics('CE leverage_open_position_receipt_confirm', null, null, analyticsData);

    await createOrderRequest();
    setLeverageModalIsActive(false);
  };

  const getButtonTitle = (): string => {
    if (orderType === OrderType.MARKET) {
      return t('confirmLeverage');
    } else if (orderType === OrderType.LIMIT) {
      return t('confirmLimit');
    } else if (orderType === OrderType.STOP_LIMIT) {
      return t('confirmStopLimit');
    } else if (orderType === OrderType.TAKE_PROFIT) {
      return t('confirmProfitLimit');
    }
    return '';
  };
  const buttonTitle = getButtonTitle();
  return (
    <>
      <WidgetSendButton isLoading={isLoading} disabled={tradeIsDisabled()} title={buttonTitle} onClick={requestTrade} />

      <Modal active={leverageModalIsActive} setActive={setLeverageModalIsActive}>
        <LeverageModal
          openPosition={handleOrderCreation}
          isLoading={isLoading}
          triggerPrice={triggerPrice ? triggerPrice.toFixed(2) : '-'}
          market={currentMarket.market}
          price={`$${price}`}
          amount={size}
          liquidationPrice={liquidationPrice ? `$${liquidationPrice.toFixed(2)}` : '-'}
          fee={fee ? `$${fee.toFixed(2)}` : '-'}
          orderType={orderType}
          buttonTitle={buttonTitle}
        />
      </Modal>
    </>
  );
};

export default React.memo(OpenOrderButton);

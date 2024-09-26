import React, { useState } from 'react';
import style from '../LeverageTransactionModal.module.css';
import { CheckBoxList } from '@/ui-kit/CheckBoxList/CheckBoxList';
import useMultilingual from '@/hooks/useMultilingual';
import LeverageWidgetClarification from '../../../../Widget/LeverageTrade/LeverageWidgetClarification';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import { defaultUnit, InputFieldType, Unit } from './common';
import InputField from './InoutField';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { ApiOrder, OrderSide, OrderType, PartialBy, TimeInForce } from '@dydxprotocol/v3-client';
import dayjs from 'dayjs';
import { LIMIT_FEE } from '@/common/LeverageTradeConstants';
import { clientManager } from '@/common/DydxClientManager';
import { setLeverageOrderError } from '@/redux/leverageSlice';
import { formatSize } from '@/common/leverageCalculations';

interface Props {
  order: any;
  setModalActive: (a: boolean) => void;
}

const PositionAutoClose: React.FC<Props> = ({ order, setModalActive }) => {
  const { t } = useMultilingual('leverageModal');
  const { c } = useMultilingual('leverageModalTooltip');
  const dispatch = useAppDispatch();
  const checkBoxes = [
    { title: t('profit'), value: OrderType.TAKE_PROFIT },
    { title: t('stopLoss'), value: OrderType.STOP_LIMIT },
  ];

  const positionId = useAppSelector(({ dydxData }) => dydxData.account.positionId);
  const market = useAppSelector(({ dydxData }) => dydxData.markets[order.market]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitAmount, setTakeProfitAmount] = useState<number>(null);
  const [stopLossAmount, setStopLossAmount] = useState<number>(null);
  const [takeProfitUnits, setTakeProfitUnits] = useState(defaultUnit);
  const [stopLossUnits, setStopLossUnits] = useState(defaultUnit);

  const orderSize = Math.abs(Number(order.size));
  const openingOrderValue = Number(orderSize) * Number(order.entryPrice);

  const checkBoxOnChange = (selected: string[]) => {
    if (selected.indexOf(OrderType.TAKE_PROFIT) !== -1) {
      setTakeProfitEnabled(true);
    } else {
      setTakeProfitEnabled(false);
      setTakeProfitAmount(null);
    }

    if (selected.indexOf(OrderType.STOP_LIMIT) !== -1) {
      setStopLossEnabled(true);
    } else {
      setStopLossEnabled(false);
      setStopLossAmount(null);
    }
  };

  const toggleOnChange = (inputField: InputFieldType, value: Unit) => {
    if (inputField === InputFieldType.TakeProfit) {
      setTakeProfitUnits(value);
    } else if (inputField === InputFieldType.StopLoss) {
      setStopLossUnits(value);
    }
  };

  const inputOnChange = (inputField: InputFieldType, value: string) => {
    if (inputField === InputFieldType.TakeProfit) {
      setTakeProfitAmount(Number(value));
    } else if (inputField === InputFieldType.StopLoss) {
      setStopLossAmount(Number(value));
    }
  };

  const calculateOrderPrice = (orderType: OrderType): number => {
    console.log('openPrice', order.entryPrice);
    let desiredOrderValue: number;
    let difference: number;
    if (orderType === OrderType.TAKE_PROFIT) {
      difference = takeProfitUnits === Unit.Usd ? takeProfitAmount : (openingOrderValue * takeProfitAmount) / 100;
    } else {
      difference = stopLossUnits === Unit.Usd ? stopLossAmount : (openingOrderValue * stopLossAmount) / 100;
    }

    if (
      (order.side === 'SHORT' && orderType === OrderType.TAKE_PROFIT) ||
      (order.side === 'LONG' && orderType === OrderType.STOP_LIMIT)
    ) {
      desiredOrderValue = openingOrderValue - difference;
    } else {
      desiredOrderValue = openingOrderValue + difference;
    }
    return desiredOrderValue / Number(orderSize);
  };

  const getTradeObject = (orderType: OrderType): PartialBy<ApiOrder, 'clientId' | 'signature'> => {
    const expiration = dayjs().add(1, 'month').toISOString();
    const desiredPrice = calculateOrderPrice(orderType);

    const side = order.side === 'SHORT' ? OrderSide.BUY : OrderSide.SELL;
    const price = formatSize(desiredPrice, market.tickSize, side === OrderSide.BUY ? 0.005 : -0.005);
    const size = formatSize(orderSize, market.stepSize, 0);
    const triggerPrise = formatSize(desiredPrice, market.tickSize, 0);

    return {
      market: order.market,
      side: order.side === 'SHORT' ? OrderSide.BUY : OrderSide.SELL,
      type: orderType,
      timeInForce: TimeInForce.FOK,
      postOnly: false,
      size: size,
      price: price,
      limitFee: LIMIT_FEE,
      triggerPrice: triggerPrise,
      expiration,
    };
  };

  const createOrderRequest = async (tradeObj: PartialBy<ApiOrder, 'clientId' | 'signature'>) => {
    try {
      await clientManager.client.private.createOrder(tradeObj, positionId);
    } catch (e) {
      console.error(e);
      const res = { ...e };
      if (res?.data?.errors?.[0]?.msg) {
        dispatch(setLeverageOrderError(res.data.errors[0].msg));
      }
      setIsLoading(false);
    }
  };

  const buttonOnClick = async () => {
    setIsLoading(true);
    if (takeProfitEnabled) {
      const tradeObject = getTradeObject(OrderType.TAKE_PROFIT);
      await createOrderRequest(tradeObject);
    }

    if (stopLossEnabled) {
      const tradeObject = getTradeObject(OrderType.STOP_LIMIT);
      await createOrderRequest(tradeObject);
    }
    setModalActive(false);
  };

  const buttonIsDisabled = () => {
    if (isLoading) return true;
    if (!(stopLossEnabled || takeProfitEnabled)) return true;
    if (stopLossEnabled && !(stopLossAmount > 0)) return true;
    if (takeProfitEnabled && !(takeProfitAmount > 0)) return true;
  };

  return (
    <div className={style.wrapperModal}>
      <h3 className={`${style.titleModal}`}>{t('positionAutoClose')}</h3>
      <p className={`${style.descriptionModal} ${style.titleBottomMargin}`}>{`${
        order.side === 'LONG' ? t('buy') : t('sell')
      } ${Math.abs(order.size)} ${order.market} ($${(Math.abs(order.size) * Number(market.oraclePrice)).toFixed(
        2
      )})`}</p>

      <p className={style.descriptionModal}>{t('selectOptions')}</p>

      <CheckBoxList wrapperStyles={style.checkBoxListWrapper} onChange={checkBoxOnChange} checkBoxes={checkBoxes} />
      <div className={!takeProfitEnabled ? style.inputBlockDisabled : ''}>
        <LeverageWidgetClarification label={t('setTakeProfit')} helperText={c('setTakeProfit')} />
        <InputField
          disabled={!takeProfitEnabled}
          inputField={InputFieldType.TakeProfit}
          value={takeProfitAmount}
          inputOnChange={inputOnChange}
          toggleOnChange={toggleOnChange}
        />
      </div>

      <div className={!stopLossEnabled ? style.inputBlockDisabled : ''}>
        <LeverageWidgetClarification label={t('setStopLoss')} helperText={c('setStopLoss')} />
        <InputField
          disabled={!stopLossEnabled}
          inputField={InputFieldType.StopLoss}
          value={stopLossAmount}
          inputOnChange={inputOnChange}
          toggleOnChange={toggleOnChange}
        />
      </div>
      <ButtonSimple
        isLoading={isLoading}
        disabled={buttonIsDisabled()}
        className={style.buttonWrapper}
        onClick={buttonOnClick}
      >
        {t('placeOrder')}
      </ButtonSimple>
    </div>
  );
};

export default React.memo(PositionAutoClose);

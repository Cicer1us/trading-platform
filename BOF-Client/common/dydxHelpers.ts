import {
  OrderResponseObject,
  OrderSide,
  OrderStatus,
  OrderType,
  PositionResponseObject,
  TransferResponseObject,
  FillResponseObject,
} from '@dydxprotocol/v3-client';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';

export const getMarketBySymbol = (symbol: string) => `${symbol}-USD`;

export const getHumanReadableOderType = (orderType: OrderType) => {
  switch (orderType) {
    case OrderType.MARKET:
      return 'Market';
    case OrderType.LIMIT:
      return 'Limit';
    case OrderType.STOP_LIMIT:
      return 'Stop Limit';
    case OrderType.TAKE_PROFIT:
      return 'Take Profit';
    default:
      return '';
  }
};

export const digestOrderBasicProperties = (order: OrderResponseObject | FillResponseObject) => {
  const type = getHumanReadableOderType(order.type).toLowerCase();
  const side = order.side === OrderSide.BUY ? 'Buy' : 'Sell';
  const size = Math.abs(Number(order.size));
  const tokenName = order.market.substring(0, order.market.indexOf('-'));

  return {
    type,
    side,
    size,
    tokenName,
  };
};

export const digestPositionBasicProperties = (position: PositionResponseObject) => {
  const side = position.side === 'LONG' ? 'Buy' : 'Sell';
  const size = Math.abs(Number(position.size));
  const tokenName = position.market.substring(0, position.market.indexOf('-'));

  return {
    side,
    size,
    tokenName,
  };
};

export enum OperationType {
  Transfer,
  Order,
  Position,
  Fill,
}

export const showNotification = (
  type: OperationType,
  object: OrderResponseObject | TransferResponseObject | FillResponseObject,
  firstLoad: boolean
) => {
  switch (type) {
    case OperationType.Transfer:
      transferNotification(object as TransferResponseObject);
      break;
    case OperationType.Order:
      orderNotification(object as OrderResponseObject, firstLoad);
      break;
    case OperationType.Fill:
      fillNotification(object as FillResponseObject);
  }
};

const transferNotification = (transfer: TransferResponseObject) => {
  if (transfer.type === 'DEPOSIT' && transfer.status === 'CONFIRMED') {
    Notify({ state: NotifyEnum.SUCCESS, title: 'Deposit', message: 'Funds are available for trading now!' });
  } else if (transfer.type === 'DEPOSIT' && transfer.status === 'PENDING') {
    Notify({ state: NotifyEnum.PENDING, title: 'Deposit', message: 'Deposit is confirmed, wait a little...' });
  }

  if (transfer.type === 'FAST_WITHDRAWAL' || transfer.type === 'WITHDRAWAL') {
    if (transfer.status === 'CONFIRMED') {
      Notify({ state: NotifyEnum.SUCCESS, title: 'Withdrawal', message: 'Withdrawal is confirmed.' });
    } else if (transfer.status === 'QUEUED') {
      Notify({
        state: NotifyEnum.PENDING,
        title: 'Withdrawal',
        message: 'Your withdrawal request was successfully submitted.',
      });
    }
  }
};

const orderNotification = (order: OrderResponseObject, firstLoad: boolean) => {
  if (order.status === OrderStatus.CANCELED && !firstLoad) {
    const { type, side, size, tokenName } = digestOrderBasicProperties(order);
    Notify({
      state: NotifyEnum.SUCCESS,
      title: `Order Canceled`,
      message: `Your ${side.toLowerCase()} ${type} order was canceled for ${size} ${tokenName}`,
    });
  }

  if (!firstLoad && (order.status === OrderStatus.OPEN || order.status === OrderStatus.UNTRIGGERED)) {
    if (order.remainingSize !== order.size) {
      return;
    }
    const { type, side, size, tokenName } = digestOrderBasicProperties(order);
    Notify({
      state: NotifyEnum.SUCCESS,
      title: `${side} ${tokenName}`,
      message: `Your ${type} order was placed for ${size} ${tokenName}`,
    });
  }
};

const fillNotification = (fill: FillResponseObject) => {
  const { type, side, size, tokenName } = digestOrderBasicProperties(fill);
  Notify({
    state: NotifyEnum.SUCCESS,
    title: `${side} ${tokenName}`,
    message: `Your ${type} order was filled for ${size} ${tokenName}`,
  });
};

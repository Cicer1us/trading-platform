import { calcLiquidationPrice } from '@/common/leverageCalculations';
import { AccountResponseObject, PositionResponseObject, PositionStatus } from '@dydxprotocol/v3-client';
import { IDydxDataState, MarketsMap } from '@/redux/dydxDataSlice';
import { clientManager } from '@/common/DydxClientManager';
import dayjs from 'dayjs';

export const createMarketPositionsArray = (dydxData: IDydxDataState) => {
  if (!dydxData?.account?.openPositions) return [];

  const totalMaintenanceMarginRequirement = dydxData.totalMaintenanceMarginRequirement;
  const markets = dydxData.markets;
  const positions = [];

  for (const [, value] of Object.entries(dydxData?.account?.openPositions)) {
    const amountField = `${Math.abs(Number(value.size))} ${value.market.substring(0, value.market.indexOf('-'))}`;
    positions.push({
      pair: `${value.market.substring(0, value.market.indexOf('-'))}/USDC`,
      market: value.market,
      leverage: (
        (Math.abs(Number(value.size)) * Number(markets[value.market].indexPrice)) /
        Number(dydxData.account.equity)
      ).toFixed(2),
      side: value.side,
      pl: Number(value.unrealizedPnl).toFixed(2),
      position: amountField,
      status: value.status,
      entryPrice: value.entryPrice,
      size: value.size,
      subInfo: getSubInfo(dydxData.account, markets, totalMaintenanceMarginRequirement, value),
    });
  }
  positions.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return positions;
};

export const getClosedAndLiquidatedPositions = async (dydxData: IDydxDataState) => {
  const totalMaintenanceMarginRequirement = dydxData.totalMaintenanceMarginRequirement;
  const markets = dydxData.markets;
  const positions = [];

  const res = await clientManager.client.private.getPositions({
    limit: 20,
    createdBeforeOrAt: dayjs().toISOString(),
  });

  for (const [, value] of Object.entries(res.positions)) {
    const amountField = `${value.sumClose} ${value.market.substring(0, value.market.indexOf('-'))}`;

    if (value.status != PositionStatus.OPEN) {
      positions.push({
        pair: value.market.replace('-', '/'),
        market: value.market,
        leverage: '-',
        side: value.side,
        pl: Number(value.realizedPnl).toFixed(2),
        position: amountField,
        status: value.status,
        subInfo: getSubInfo(dydxData.account, markets, totalMaintenanceMarginRequirement, value),
        closedAt: value.closedAt,
      });
    }
  }

  positions.sort((a, b) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime());

  return positions;
};

const getSubInfo = (
  account: AccountResponseObject,
  markets: MarketsMap,
  totalMaintenanceMarginRequirement: number,
  value: PositionResponseObject
) => {
  return [
    [
      {
        subAlias: '1',
        name: 'Liquidation price',
        helperText: 'liquidationPriceHelper',
        value:
          value.status === PositionStatus.OPEN
            ? calcLiquidationPrice(
                markets[value.market],
                Number(account.equity),
                totalMaintenanceMarginRequirement,
                Number(value.size),
                value.side === 'LONG',
                false
              ).toFixed(2)
            : '-',
        prefix: '$',
        type: 'Number',
        translateName: 'liquidationPrice',
      },
      {
        subAlias: '2',
        name: 'Funding',
        helperText: 'fundingHelper',
        value: value.netFunding,
        prefix: '$',
        type: 'Number',
        translateName: 'funding',
      },
    ],
    [
      {
        subAlias: '3',
        name: 'Opening Time',
        helperText: 'openingTimeHelper',
        value: value.createdAt,
        type: 'Data',
        translateName: 'openingTime',
      },
      {
        subAlias: '4',
        name: 'Closing Time',
        helperText: 'closingTimeHelper',
        value: value.closedAt,
        type: 'Data',
        translateName: 'closingTime',
      },
    ],
    [
      {
        subAlias: '5',
        name: 'Average Open',
        helperText: 'averageOpenHelper',
        value: Number(value.entryPrice).toFixed(2),
        prefix: '$',
        type: 'Number',
        translateName: 'averageOpen',
      },
      {
        subAlias: '2',
        name: 'Average Close',
        helperText: 'averageCloseHelper',
        value: Number(value.exitPrice).toFixed(2),
        prefix: '$',
        type: 'Number',
        translateName: 'averageClose',
      },
    ],
  ];
};

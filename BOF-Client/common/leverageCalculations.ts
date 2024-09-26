import { MarketResponseObject } from '@dydxprotocol/v3-client';

export const calcLeverageAndUsdAmount = (
  assetPrice: number,
  assetAmount: number,
  equity: number
): { usdAmount: number; leverageLevel: number } => {
  if (!equity || !assetAmount || !assetPrice) {
    return { usdAmount: 0, leverageLevel: 0 };
  }
  const usdAmount = assetAmount * assetPrice;
  const leverageLevel = usdAmount / equity;

  return { usdAmount, leverageLevel };
};

export const calcTokenAndUsdAmount = (
  assetPrice: number,
  leverageLevel: number,
  equity: number
): { usdAmount: number; assetAmount: number } => {
  if (!equity || !leverageLevel || !assetPrice) {
    return { usdAmount: 0, assetAmount: 0 };
  }
  const usdAmount = leverageLevel * equity;
  const assetAmount = usdAmount / assetPrice;

  return { usdAmount, assetAmount };
};

export const calcTokenAndLeverageAmount = (
  usdAmount: number,
  assetPrice: number,
  equity: number
): { leverageLevel: number; assetAmount: number } => {
  if (!equity || !assetPrice || !assetPrice) {
    return { leverageLevel: 0, assetAmount: 0 };
  }
  const leverageLevel = usdAmount / equity;
  const assetAmount = usdAmount / assetPrice;

  return { leverageLevel, assetAmount };
};

export const formatSize = (price: number, maxStepSize: string, deviation: number): string => {
  const priceWithDeviation = price * (1 + deviation);
  return priceWithDeviation.toFixed(maxStepSize.indexOf('.') > 0 ? maxStepSize?.length - 2 : 0);
};

export const calcLiquidationPrice = (
  currentMarket: MarketResponseObject,
  equity: number,
  totalMaintenanceMarginRequirement: number,
  tokenAmount: number,
  isBuy: boolean,
  isNewOrder
): number => {
  let liqPrice = 0;
  const currentPrice = Number(currentMarket.indexPrice);
  let newMaintenanceFraction = 0;

  if (isNewOrder) {
    newMaintenanceFraction =
      Math.abs(tokenAmount * currentPrice * Number(currentMarket.maintenanceMarginFraction)) +
      totalMaintenanceMarginRequirement;
  } else {
    newMaintenanceFraction = totalMaintenanceMarginRequirement;
  }

  if (isBuy) {
    liqPrice = Math.abs(
      currentPrice * (1 - (Number(currentMarket.maintenanceMarginFraction) * equity) / newMaintenanceFraction)
    );
  } else {
    liqPrice = Math.abs(
      currentPrice * (1 + (Number(currentMarket.maintenanceMarginFraction) * equity) / newMaintenanceFraction)
    );
  }
  const diff = liqPrice % Number(currentMarket.tickSize);
  return liqPrice - diff;
};

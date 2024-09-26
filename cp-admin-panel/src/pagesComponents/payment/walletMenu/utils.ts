export const MIN_SLIPPAGE = 0;
export const MAX_SLIPPAGE = 10_000;
const SLIPPAGE_MULTIPLIER = 100;

export const slippageFromPercentage = (percentage: number): number =>
  Number((percentage * SLIPPAGE_MULTIPLIER).toFixed(3));

export const slippageToPercentage = (slippage: number): number => Number((slippage / SLIPPAGE_MULTIPLIER).toFixed(3));

export const slippageValidationErrorMessage = `Please enter a value between ${slippageToPercentage(
  MIN_SLIPPAGE
)}% and ${slippageToPercentage(MAX_SLIPPAGE)}%`;

export const CheckDollarTokens = (tokenName: string): boolean => {
  if (tokenName === 'USDT' || tokenName === 'USDC' || tokenName === 'DAI') {
    return true;
  }

  return false;
};

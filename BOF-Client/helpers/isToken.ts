import Web3 from 'web3';

export const isToken = (token: any) => {
  if (!Web3.utils.isAddress(token?.address)) return false;
  return token.symbol && token.name && token.decimals;
};

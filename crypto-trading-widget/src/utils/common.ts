import { Token } from '../data/tokens/token.interface';

export const convertTokensMapIntoTokenListArray = (tokensMap: { [key: string]: Token }) => {
  const tokensArray: Token[] = [];
  Object.keys(tokensMap).forEach(key => {
    tokensArray.push(tokensMap[key]);
  });
  return tokensArray;
};

export const decimalsToWeiUnit: Record<number, any> = {
  1: 'wei',
  4: 'kwei',
  6: 'mwei',
  9: 'gwei',
  12: 'micro',
  15: 'milliether',
  18: 'ether',
  21: 'kether',
  24: 'mether',
  27: 'gether',
  30: 'tether',
};

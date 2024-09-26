import { Chain } from './utils/chains';
import * as process from 'process';

export const PARTNER = '0xb18a6bf7e677ad4bd3ca86222f21972d8f7d558a';
export const FEE = '20';
export const AVAILABLE_CHAINS = [Chain.Ethereum, Chain.Polygon, Chain.Bsc, Chain.Avalanche, Chain.Fantom];

export const NO_NFT_IMAGE_URL = `${process.env.REACT_APP_STORAGE}/no_image.png`;
export const BITOFTRADE_LOGO_URL = `${process.env.REACT_APP_STORAGE}/bitoftrade-logo.png`;

export const WALLET_CONNECT_PROJECT_ID = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
export const EMPTY_ARRAY = [];

// TODO: think about better way to handle this
export const ON_SALE_NFT_ORDER_HASH = '0x957e66a6a11003b96562ee57abe5f7316fc61f2864042cbb7bece556e2146b97';
export const WIDGET_CDN_URL =
  process.env.REACT_APP_CRYPTO_TRADING_WIDGET_URL ??
  'https://unpkg.com/@bitoftrade/crypto-trading-widget-sdk/build/index.js';
export const PARASWAP_API_URL = 'https://api.paraswap.io';

export const NFT_PORTFOLIO_ROUTE = '/nft-portfolio';

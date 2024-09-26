import { TokenCategory } from '@/interfaces/Markets.interface';

export const tokenCategories: TokenCategory[] = [
  {
    id: 'storage',
    name: 'Storage',
    coinMarketId: '5fb62da404d1dd4c73744883',
  },
  {
    id: 'iot',
    name: 'IoT',
    coinMarketId: '6051a82366fc1b42617d6dc4',
  },
  {
    id: 'sports',
    name: 'Sports',
    coinMarketId: '6051a81666fc1b42617d6db2',
  },
  {
    id: 'privacy',
    name: 'Privacy',
    coinMarketId: '604f273debccdd50cd175fb0',
  },
  {
    id: 'social-money',
    name: 'Social Money',
    coinMarketId: '604f2771ebccdd50cd175fd8',
  },
  {
    id: 'defi',
    name: 'DeFi',
    coinMarketId: '5fb62883c9ddcc213ed13308',
  },
  {
    id: 'dao-maker',
    name: 'DAO Maker',
    coinMarketId: '605b2279972c9053da7021a3',
  },
  {
    id: 'tokenized-gold',
    name: 'Tokenized Gold',
    coinMarketId: '625d09d246203827ab52dd53',
  },
  {
    id: 'vr-ar',
    name: 'VR/AR',
    coinMarketId: '6051a81866fc1b42617d6db5',
  },
  {
    id: 'ai-big-data',
    name: 'AI & Big Data',
    coinMarketId: '6051a81a66fc1b42617d6db7',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    coinMarketId: '6051a82d66fc1b42617d6dd0',
  },
  {
    id: 'stablecoin',
    name: 'Stablecoin',
    coinMarketId: '604f2753ebccdd50cd175fc1',
  },
  {
    id: 'decentralized-exchange',
    name: 'Decentralized Exchange',
    coinMarketId: '604f2738ebccdd50cd175fac',
  },
  {
    id: 'asset-management',
    name: 'Asset Management',
    coinMarketId: '6051a80266fc1b42617d6d98',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    coinMarketId: '6053e0ba78714a47f3a85999',
  },
];

export const MARKETS_TABLE_ROWS = 10;
export const getMarketLogoURI = (id: number) => `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;

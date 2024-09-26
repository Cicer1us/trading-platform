import { TRADING } from '@/common/LocationPath';
import TagManager from 'react-gtm-module';

const collectVP = () => {
  setTimeout(() => {
    const storage = globalThis?.sessionStorage;
    const localStorage = globalThis?.localStorage;
    if (!storage || !localStorage) return;

    const prevPath = storage.getItem('prevPath');
    const currentPath = storage.getItem('currentPath');
    const clientAddress = storage.getItem('clientAddress');

    // TODO: delete deprecated selectedTrPair
    const selectedTrPair = JSON.parse(localStorage.getItem('selectedTrPair'));

    const prevPathShow = prevPath === 'null' ? undefined : prevPath;

    const symbol =
      selectedTrPair?.tokenA && selectedTrPair?.tokenB
        ? `${selectedTrPair?.tokenA}/${selectedTrPair?.tokenB}`
        : undefined;

    const tagManagerArgsVP = {
      gtmId: process.env.NEXT_PUBLIC_GA_ID,
      dataLayer: {
        event: `VP ${currentPath}`,
        page: {
          from_path: prevPathShow,
          to_path: currentPath,
          trading_token_pair: currentPath === TRADING ? symbol : undefined,
        },
        wallet_properties: clientAddress && clientAddress !== 'undefined' ? { wallet_id: clientAddress } : {},
      },
    };
    TagManager.dataLayer(tagManagerArgsVP);
  }, 1000);
};

export default collectVP;

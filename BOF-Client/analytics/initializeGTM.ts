import React from 'react';
import TagManager from 'react-gtm-module';
import eventsList from './eventsList.json';

const initializeGTM = (pathname: string): void => {
  const noneSpa = ['/', '/blog', '/blog/[article]'];

  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  const spaStatus = !noneSpa.includes(pathname);

  const clientAddress = storage.getItem('clientAddress');

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_ID,
    dataLayer: {
      page: { spa: spaStatus },
      wallet_properties: clientAddress && clientAddress !== 'undefined' ? { wallet_id: clientAddress } : {},
    },
    events: eventsList,
  };
  TagManager.initialize(tagManagerArgs);
};
export default initializeGTM;

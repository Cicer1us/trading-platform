import TagManager from 'react-gtm-module';
import eventsList from './eventsList.json';

const initializeGTM = (pathname: string): void => {
  const noneSpa = ['/', '/blog', '/blog/[article]'];

  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  const spaStatus = !noneSpa.includes(pathname);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_ID,
    dataLayer: {
      page: { spa: spaStatus },
    },
    events: eventsList,
  };
  TagManager.initialize(tagManagerArgs);
};
export default initializeGTM;

import TagManager from 'react-gtm-module';

const collectVP = () => {
  setTimeout(() => {
    const storage = globalThis?.sessionStorage;
    const localStorage = globalThis?.localStorage;
    if (!storage || !localStorage) return;

    const prevPath = storage.getItem('prevPath');
    const currentPath = storage.getItem('currentPath');

    const prevPathShow = prevPath === 'null' ? undefined : prevPath;

    const tagManagerArgsVP = {
      gtmId: process.env.NEXT_PUBLIC_GA_ID,
      dataLayer: {
        event: `VP ${currentPath}`,
        page: {
          from_path: prevPathShow,
          to_path: currentPath,
        },
      },
    };
    TagManager.dataLayer(tagManagerArgsVP);
  }, 1000);
};

export default collectVP;

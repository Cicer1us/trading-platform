import en from 'locales/en';
import ru from 'locales/ru';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import store from '@/redux/store';

interface IGetSubCategory {
  t: (subCategory: string) => string;
  c: (subCategory: string) => string;
  tc: (subCategory: string) => (params: string[]) => string;
}

export const getT = category => {
  const state = store.getState();
  const lang = state.app.language;
  let source;

  switch (lang) {
    case 'ru':
      source = ru;
      break;
    default:
      source = en;
      break;
  }
  return subCategory => source[category][subCategory];
};

const useMultilingual = (category: string): IGetSubCategory => {
  const locale = useAppSelector(({ app }) => app?.language);

  let source;
  switch (locale) {
    case 'ru':
      source = ru;
      break;
    default:
      source = en;
      break;
  }

  return {
    t: subCategory => source[category][subCategory],
    tc: subCategory => source[category][subCategory],
    c: subCategory => source[category][subCategory],
  };
};

export default useMultilingual;

import { CmsArticle } from '@/interfaces/CMS.interface';
import { CryptoPanicPost } from '@/interfaces/Cryptopanic.interface';
import { CoinMarketToken } from '@/interfaces/Markets.interface';
import { Entry } from 'contentful';
import React from 'react';
import { MarketsArticles } from './MarketsArticles/MarketsArticles';
import { MarketsNews } from './MarketsNews/MarketsNews';
import style from './MarketsInfo.module.css';
import useMultilingual from '@/hooks/useMultilingual';

interface MarketsInfoProps {
  news: CryptoPanicPost[];
  articles: Entry<CmsArticle>[];
  tokens: CoinMarketToken[];
}

export const MarketsInfo: React.FC<MarketsInfoProps> = ({ news, articles, tokens }: MarketsInfoProps) => {
  const { t } = useMultilingual('markets');
  return (
    <div className={style.info}>
      <div className={style.infoItem}>
        <div className={style.title}>{t('news')}</div>
        <MarketsNews news={news} tokens={tokens} />
      </div>
      <div className={style.infoItem}>
        <div className={style.title}>{t('blogs')}</div>
        <MarketsArticles articles={articles} />
      </div>
    </div>
  );
};

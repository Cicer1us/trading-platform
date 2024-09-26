import { CmsArticle } from '@/interfaces/CMS.interface';
import MarketArticleCard from '@/components/MarketArticleCard/MarketArticleCard';
import Card from '@/ui-kit/Card/Card';
import { Entry } from 'contentful';
import React from 'react';
import style from './MarketsArticles.module.css';
import useMultilingual from '@/hooks/useMultilingual';

interface MarketsArticlesProps {
  articles: Entry<CmsArticle>[];
}

export const MarketsArticles: React.FC<MarketsArticlesProps> = ({ articles }) => {
  const { t } = useMultilingual('markets');
  return (
    <Card className={style.card}>
      <div className={`${style.articles} scroll`}>
        <div className={style.link}>
          <a href={`/blog`} target="_blank" rel="noopener noreferrer">
            {t('blogButton')}
          </a>
        </div>
        {articles.map(article => (
          <MarketArticleCard
            key={article.fields.slug}
            slug={article.fields.slug}
            date={article.sys.createdAt}
            title={article.fields.title}
            imgUrl={article.fields.thumbnailImage.fields.file.url}
          />
        ))}
      </div>
    </Card>
  );
};

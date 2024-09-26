import React, { useState } from 'react';
import Card from '@/ui-kit/Card/Card';
import style from './MarketsTable.module.css';
import { tokenCategories } from 'constants/markets';
import { CoinMarketPrice } from '@/interfaces/Markets.interface';
import { AllMarketsTable } from './AllMarketsTable';
import { CategoryMarketsTable } from './CategoryMarketsTable';
import useMultilingual from '@/hooks/useMultilingual';

export interface MarketsTableData {
  data: CoinMarketPrice[];
  totalCount: number;
}

interface MarketsTableProps {
  markets: MarketsTableData;
}

export const MarketsTable: React.FC<MarketsTableProps> = ({ markets }: MarketsTableProps) => {
  const { t } = useMultilingual('markets');
  // default value null means all categories
  const [category, setCategory] = useState<string>(null);
  const [isMarketsLoading, setIsMarketsLoading] = useState<boolean>(false);

  return (
    <div className={style.markets}>
      <div className={style.title}>{t('tokenTable')}</div>
      <div className={style.categories}>
        <div
          className={`${style.category} ${category === null ? style.active : ''} ${
            isMarketsLoading ? style.disabled : ''
          }`}
          onClick={() => setCategory(null)}
        >
          <div className={style.categoryTitle}>{t('allCategories')}</div>
        </div>
        {tokenCategories.map(cat => (
          <div
            key={cat.id}
            className={`${style.category} ${cat.id === category ? style.active : ''} ${
              isMarketsLoading ? style.disabled : ''
            }`}
            onClick={() => setCategory(cat.id)}
          >
            <div className={style.categoryTitle}>{cat.name}</div>
          </div>
        ))}
      </div>
      <Card className={style.card}>
        <div className={style.table}>
          {category === null ? (
            <AllMarketsTable markets={markets} />
          ) : (
            <CategoryMarketsTable
              categoryId={category}
              isMarketsLoading={isMarketsLoading}
              setIsMarketsLoading={setIsMarketsLoading}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

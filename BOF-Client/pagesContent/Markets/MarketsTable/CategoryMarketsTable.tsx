import { MARKETS } from '@/common/LocationPath';
import { Pagination } from '@/components/Pagination/Pagination';
import Table, { IColumn } from '@/components/Table/Table';
import { getAvailableMarketChains } from '@/helpers/getAvailableMarketChains';
import { getMarketsTableRows } from '@/helpers/getMarketsTableRows';
import useMultilingual from '@/hooks/useMultilingual';
import { MarketRow } from '@/interfaces/Markets.interface';
import fetchCategoryMarkets from 'API/markets/getCategoryMarkets';
import { MARKETS_TABLE_ROWS, tokenCategories } from 'constants/markets';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DotLoader } from 'react-spinners';
import { MarketTableConfig } from './MarketsTable.config';
import style from './MarketsTable.module.css';

interface CategoryMarketsTableProps {
  categoryId: string;
  isMarketsLoading: boolean;
  setIsMarketsLoading: (loading: boolean) => void;
}

interface SortState {
  sort?: string;
  sort_dir?: 'asc' | 'desc';
}

const getSortedMarkets = (sortState: SortState, markets: MarketRow[]) => {
  if (!sortState?.sort) return markets;
  const sortDir = sortState.sort_dir === 'asc' ? 1 : -1;
  const sortCompare = (a, b) => (Number(a[sortState.sort]) - Number(b[sortState.sort])) * sortDir;
  return markets.sort(sortCompare);
};

export const CategoryMarketsTable: React.FC<CategoryMarketsTableProps> = ({
  categoryId,
  setIsMarketsLoading,
  isMarketsLoading,
}: CategoryMarketsTableProps) => {
  const [markets, setMarkets] = useState<MarketRow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortState, setSortState] = useState<SortState>({});
  const { t } = useMultilingual('markets');
  const router = useRouter();

  const getSlicedMarkets = (markets: MarketRow[], page?: number) => {
    const slicedPage = page ?? currentPage;
    return markets.slice(slicedPage * MARKETS_TABLE_ROWS, (slicedPage + 1) * MARKETS_TABLE_ROWS);
  };

  const handlePageClick = async event => {
    const page = event.selected;
    setCurrentPage(page);
    updatedMarketChains(markets, page);
  };

  const handleSortClick = async (col: IColumn) => {
    const sortState = { sort: col.alias, sort_dir: col.asc ? 'asc' : 'desc' } as SortState;
    setSortState(sortState);
    updatedMarketChains(markets);
  };

  const getMarkets = async () => {
    setIsMarketsLoading(true);
    const coinMarketId = tokenCategories.find(cat => cat.id === categoryId)?.coinMarketId;
    const marketsResponse = await fetchCategoryMarkets(coinMarketId, { limit: '600' });
    const markets = marketsResponse?.data?.coins ?? [];
    const marketRows = getMarketsTableRows(markets);
    setCurrentPage(0);
    setSortState({});
    setMarkets(marketRows);
    setIsMarketsLoading(false);
    updatedMarketChains(marketRows);
  };

  const updatedMarketChains = async (markets: MarketRow[], page?: number) => {
    const sortedMarkets = getSortedMarkets(sortState, markets);
    const slicedMarkets = getSlicedMarkets(sortedMarkets, page);
    const chains = await getAvailableMarketChains(slicedMarkets.map(market => market.id));
    setMarkets(markets.map(market => ({ ...market, chains: chains[market.id] ?? null })));
  };

  useEffect(() => {
    getMarkets();
  }, [categoryId]);

  const onRowClick = (row: MarketRow) => {
    router.push(`${MARKETS}/${row.id}`);
  };

  const getMarketRows = () => {
    const sortedMarkets = getSortedMarkets(sortState, markets);
    const slicedMarkets = getSlicedMarkets(sortedMarkets);
    return slicedMarkets;
  };

  const marketRows = getMarketRows();
  const totalRows = Math.ceil(markets.length / MARKETS_TABLE_ROWS);

  return isMarketsLoading ? (
    <div className={style.loader}>
      <DotLoader size={80} color={'var(--green)'} loading={true} />
    </div>
  ) : (
    <>
      {!!marketRows.length ? (
        <Table
          tableHead={MarketTableConfig}
          tableBody={marketRows}
          rowsLimit={false}
          onSortClick={handleSortClick}
          onRowClick={onRowClick}
        />
      ) : (
        <div className={style.error}>{t('somethingWentWrong')}</div>
      )}
      <div className={style.paginationWrapper}>
        <Pagination handlePageClick={handlePageClick} pageCount={totalRows} />
      </div>
    </>
  );
};

import { MARKETS } from '@/common/LocationPath';
import { Pagination } from '@/components/Pagination/Pagination';
import Table, { IColumn } from '@/components/Table/Table';
import { getAvailableMarketChains } from '@/helpers/getAvailableMarketChains';
import { getMarketsTableRows } from '@/helpers/getMarketsTableRows';
import useMultilingual from '@/hooks/useMultilingual';
import { MarketRow } from '@/interfaces/Markets.interface';
import fetchMarkets from 'API/markets/getMarkets';
import { MARKETS_TABLE_ROWS } from 'constants/markets';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DotLoader } from 'react-spinners';
import { MarketsTableData } from './MarketsTable';
import { MarketTableConfig } from './MarketsTable.config';
import style from './MarketsTable.module.css';

interface AllMarketsTableProps {
  markets: MarketsTableData;
}

interface SortState {
  sort?: string;
  sort_dir?: string;
}

export const AllMarketsTable: React.FC<AllMarketsTableProps> = ({ markets }: AllMarketsTableProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [marketRows, setMarketRows] = useState<MarketRow[]>(getMarketsTableRows(markets.data));
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortState, setSortState] = useState<SortState>({});
  const router = useRouter();
  const { t } = useMultilingual('markets');

  const totalRows = Math.ceil(markets.totalCount / MARKETS_TABLE_ROWS);

  const getStartAndLimit = (page: number) => {
    const start = page * MARKETS_TABLE_ROWS + 1;
    return { start: start.toString(), limit: MARKETS_TABLE_ROWS.toString() };
  };

  const updateMarkets = async (query: Record<string, string>) => {
    setIsLoading(true);
    const newMarkets = await fetchMarkets(query);
    const marketRows = getMarketsTableRows(newMarkets?.data ?? []);
    setMarketRows(marketRows);
    setIsLoading(false);
    updatedMarketChains(marketRows);
  };

  const handlePageClick = async event => {
    const page = event.selected;
    const query = { ...getStartAndLimit(page), ...sortState };
    setCurrentPage(page);
    await updateMarkets(query);
  };

  const handleSortClick = async (col: IColumn) => {
    const sortState = { sort: col.alias, sort_dir: col.asc ? 'asc' : 'desc' };
    const query = { ...getStartAndLimit(currentPage), ...sortState };
    setSortState(sortState);
    await updateMarkets(query);
  };

  const updatedMarketChains = async (markets: MarketRow[]) => {
    if (markets.length) {
      const chains = await getAvailableMarketChains(markets.map(market => market.id));
      setMarketRows(markets.map(market => ({ ...market, chains: chains[market.id] })));
    }
  };

  const onRowClick = (row: MarketRow) => {
    router.push(`${MARKETS}/${row.id}`);
  };

  useEffect(() => {
    updatedMarketChains(marketRows);
  }, []);

  return isLoading ? (
    <div className={style.loader}>
      <DotLoader size={80} color={'var(--green)'} loading={true} />
    </div>
  ) : (
    <>
      {!!marketRows.length ? (
        <Table
          onRowClick={onRowClick}
          tableHead={MarketTableConfig}
          tableBody={marketRows}
          rowsLimit={false}
          onSortClick={handleSortClick}
          defaultSortColumn={sortState?.sort ? { alias: sortState.sort, asc: sortState.sort_dir === 'asc' } : null}
        />
      ) : (
        <div className={style.error}>{t('somethingWentWrong')}</div>
      )}
      <div className={style.paginationWrapper}>
        <Pagination handlePageClick={handlePageClick} pageCount={totalRows} forcePage={currentPage} />
      </div>
    </>
  );
};

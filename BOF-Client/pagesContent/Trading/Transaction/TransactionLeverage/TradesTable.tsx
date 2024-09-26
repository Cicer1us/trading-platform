import React, { useEffect, useState } from 'react';
import Table from '@/components/Table/Table';
import style from './TransactionLeverage.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import useMultilingual from '@/hooks/useMultilingual';
import { clientManager } from '@/common/DydxClientManager';
import { tradesTableConfig } from './tradesTable.config';
import BeatLoader from 'react-spinners/BeatLoader';
import { Pagination } from '@/components/Pagination/Pagination';
import { getHumanReadableOderType } from '@/common/dydxHelpers';

const itemsPerPage = 8;

const TransactionLeverage = () => {
  const { t } = useMultilingual('transaction');
  const [trades, setTrades] = useState(null);
  const markets = useAppSelector(({ dydxData }) => dydxData.markets);

  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    if (!trades) return;
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(trades.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(trades.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, trades]);

  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % trades.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    clientManager.client.private.getFills({}).then(res => {
      const orders = [];
      for (const [, value] of Object.entries(res.fills)) {
        const formattedAmount = Math.abs(Number(value.size)).toFixed(
          markets[value.market].stepSize?.indexOf('.') > 0 ? markets[value.market].stepSize?.length - 2 : 0
        );
        const amountField = `${formattedAmount} ${value.market.substring(0, value.market.indexOf('-'))}`;

        orders.push({
          pair: `${value.market.substring(0, value.market.indexOf('-'))}/USDC`,
          side: value.side,
          amount: amountField,
          price: Math.abs(Number(value.price)).toFixed(2),
          total: Math.abs(Number(value.price) * Number(value.size)).toFixed(2),
          fee: value.fee,
          orderType: getHumanReadableOderType(value.type),
          closedAt: value.createdAt,
        });
      }
      orders.sort((a, b) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime());
      setTrades(orders);
    });
  }, []);

  return (
    <>
      <div className={`${style.tableWrapper}`}>
        {!(trades?.length > 0) ? (
          <div className={style.warningTextWrapper}>
            {!trades && <BeatLoader color={'var(--green)'} loading={true} size={15} />}
            {trades?.length === 0 && <h2 className={style.warningText}>{t('empty')}</h2>}
          </div>
        ) : (
          <Table
            tableHead={tradesTableConfig}
            tableBody={currentItems}
            onActionClick={() => {
              return;
            }}
            rowsLimit={false}
            minWidth="1000px"
          />
        )}
      </div>

      {trades?.length > itemsPerPage && (
        <div className={style.paginationWrapper}>
          <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
        </div>
      )}
    </>
  );
};

export default React.memo(TransactionLeverage);

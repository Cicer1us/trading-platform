import ReactPaginate from 'react-paginate';
import React from 'react';
import style from './Pagination.module.css';

interface Props {
  handlePageClick: (selectedItem: { selected: number }) => void;
  pageCount: number;
  forcePage?: number;
}

export const Pagination: React.FC<Props> = ({ handlePageClick, pageCount, forcePage }) => {
  return (
    <ReactPaginate
      forcePage={forcePage}
      nextLabel=">"
      onPageChange={handlePageClick}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      previousLabel="<"
      pageClassName={style.pageItem}
      pageLinkClassName="page-link"
      previousClassName={style.pageItem}
      previousLinkClassName="page-link"
      nextClassName={style.pageItem}
      nextLinkClassName="page-link"
      breakLabel="..."
      breakClassName={style.pageItem}
      breakLinkClassName="page-link"
      containerClassName={style.pagination}
      activeClassName={style.activeItem}
    />
  );
};

import React, { useState, useEffect } from 'react';
import style from './Table.module.css';
import { Th, Td, SeeAll } from './Cells';
import { ITableHead, ValueTypeEnum } from '@/interfaces/TableHead.interface';
import { useRouter } from 'next/router';
import DropdownButton from './DropdownButton/DropdownButton';
import SubInfo from './SubInfo/SubInfo';

interface ITable {
  tableBody: any;
  tableHead: Array<ITableHead>;
  onActionClick?: (row: any) => void;
  onSetItClick?: (row: any) => void;
  rowsLimit?: boolean;
  topTableHead?: Array<ITableHead> | null;
  minWidth?: string;
  SubInfoComponent?: (row: any) => JSX.Element;
  withSubInfo?: boolean;
  defaultSortColumn?: DefaultSortColumn;
  onSortClick?: (col: IColumn) => void;
  onRowClick?: (col) => void;
}

export interface IColumn extends ITableHead {
  asc: boolean;
  activated: boolean;
}

export interface DefaultSortColumn {
  asc: boolean;
  alias: string;
}

//  TODO: refactor this component
const Table: React.FC<ITable> = ({
  onRowClick,
  tableBody,
  tableHead,
  onActionClick,
  onSetItClick,
  rowsLimit = true,
  topTableHead = null,
  minWidth = '0px',
  withSubInfo = false,
  SubInfoComponent = null,
  onSortClick = null,
  defaultSortColumn = null,
}: ITable): JSX.Element => {
  const [columnsState, setColumnsState] = useState<Array<IColumn>>([]);
  const [seeAllCell, setSeeAllCell] = useState<boolean>(rowsLimit);
  const [activeDropdown, setActiveDropdown] = useState<number>(null);
  const router = useRouter();

  useEffect(() => {
    setColumnsState(
      tableHead.map(column =>
        column.alias === defaultSortColumn?.alias
          ? {
              ...column,
              asc: defaultSortColumn.asc,
              activated: true,
            }
          : {
              asc: true,
              ...column,
              activated: column.sortByDefault,
            }
      )
    );
  }, [router]);

  useEffect(() => {
    // todo: refactor it with adding rowValues to separeted value
    // first check if we pass rowToActive object to the table
    // then check if rowToActivate is not empty and row property in this object is not empty
    // then if was founded right row - set row property in rowToActivate object
    // if (rowToActivate && rowToActivate.rowValues && !rowToActivate.rowValues[rowToActivate.field]) {
    // 	for (const row of tableBody) {
    // 		if (row[rowToActivate.field] === rowToActivate.value) {
    // 			onRowClick(rowToActivate.field, row[rowToActivate.field], row);
    // 			return;
    // 		}
    // 	}
    // }
  }, [tableBody]);

  const onColumnClick = (columnAliasToActivate: string): void => {
    const updatedColumnState = columnsState.map(column =>
      column.alias === columnAliasToActivate
        ? {
            ...column,
            asc: !column.asc,
            activated: true,
          }
        : {
            ...column,
            activated: false,
          }
    );
    setColumnsState(updatedColumnState);
    if (onSortClick) {
      onSortClick(updatedColumnState.find(col => col.activated));
    }
  };

  const sortRows = rowsToSort => {
    if (!columnsState?.length) return [];
    if (!rowsToSort?.length) return [];
    if (onSortClick) return rowsToSort;
    const columnToSort = columnsState.find(column => column.activated);
    // console.log(columnToSort);

    switch (columnToSort?.type) {
      case ValueTypeEnum.PAIR:
      case ValueTypeEnum.STRING:
      case ValueTypeEnum.TOKEN:
        return [...rowsToSort].sort(
          (a, b) => a[columnToSort.alias]?.localeCompare(b[columnToSort.alias]) * (columnToSort.asc ? 1 : -1)
        );
      case ValueTypeEnum.NUMBER:
      case ValueTypeEnum.BIG_NUMBER:
      case ValueTypeEnum.BOOLEAN:
        return [...rowsToSort].sort(
          (a, b) => (Number(a[columnToSort.alias]) - Number(b[columnToSort.alias])) * (columnToSort.asc ? 1 : -1)
        );
      case ValueTypeEnum.DATE:
        return [...rowsToSort].sort(
          (a, b) =>
            (new Date(a[columnToSort.alias]).getTime() - new Date(b[columnToSort.alias]).getTime()) *
            (columnToSort.asc ? 1 : -1)
        );
      default:
        return [...rowsToSort];
    }
  };

  // function which calculate additional styles
  // in params we pass all additional columns from the same row
  // function "calc" calculate styles, first parameter is this column cell,
  // second and next is parameters from "params" field
  const getStyles = (column, row) =>
    column._addStyleRule ? column._addStyleRule.calc(...column._addStyleRule.params.map(param => row[param])) : '';

  const getValue = (column, row) =>
    column._addValueRule
      ? column._addValueRule.calc(...column._addValueRule.params.map(param => row[param]))
      : row[column.alias];

  const getCheck = (column, row) =>
    column._isCheckBy ? column._isCheckBy.calc(...column._isCheckBy.params.map(param => row[param])) : false;

  const handleDropdown = index => {
    if (index === activeDropdown) {
      setActiveDropdown(null);
      return;
    }
    setActiveDropdown(index);
  };

  return (
    <div className={`${style.tableWrapper} scroll`}>
      <div style={{ minWidth }}>
        <div
          className={`${style.tableContainer} ${seeAllCell ? '' : `${style.tableScroll} scroll`} ${
            rowsLimit ? style.limitHeight : ''
          }`}
        >
          <table className={style.table}>
            <thead className={style.thead}>
              {!!topTableHead?.length && (
                <tr>
                  {topTableHead.map(column => (
                    <Th
                      column={column}
                      onClick={(): void => onColumnClick(column.alias)}
                      key={column.alias}
                      sort={column.sort}
                    />
                  ))}
                </tr>
              )}
              <tr>
                {columnsState.map(column => (
                  <Th
                    column={column}
                    onClick={(): void => onColumnClick(column.alias)}
                    key={column.alias}
                    sort={column.sort}
                  />
                ))}
              </tr>
            </thead>
            <tbody className={style.tbody}>
              {sortRows(tableBody)
                .slice(0, seeAllCell ? 6 : Infinity)
                .map((row, index) => (
                  <React.Fragment key={index}>
                    <tr onClick={() => onRowClick && onRowClick(row)}>
                      {columnsState.map((col, indexColumn) => {
                        if (col.type === ValueTypeEnum.DROPDOWN) {
                          return (
                            <DropdownButton
                              id={index}
                              handleDropdown={handleDropdown}
                              isActive={activeDropdown === index}
                              key={`${row[col.alias]} ${indexColumn}`}
                            />
                          );
                        }
                        return (
                          <Td
                            // use value as key to prevent hash duplicate event after rows were updated
                            key={`${row[col.alias]} ${indexColumn} ${getValue(col, row)}`}
                            additionalStyle={getStyles(col, row)}
                            value={getValue(col, row)}
                            column={col}
                            isHaveDollarsTokens={getCheck(col, row)}
                            onActionClick={(): void => onActionClick(row)}
                            onSetItClick={(): void => onSetItClick(row)}
                          />
                        );
                      })}
                    </tr>
                    {withSubInfo && activeDropdown === index && (
                      <SubInfo SubInfoComponent={SubInfoComponent} row={row} colSpan={columnsState.length} />
                    )}
                  </React.Fragment>
                ))}
              {rowsLimit && tableBody?.length >= 6 && (
                <SeeAll seeAllState={seeAllCell} toggleState={setSeeAllCell} colSpan={columnsState.length} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;

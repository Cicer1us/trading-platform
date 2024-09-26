import React from 'react';
import NumberFormat from 'react-number-format';
import style from './Table.module.css';
import { ArrowSort } from '@/icons/ArrowSort';
import { ValueTypeEnum } from '@/interfaces/TableHead.interface';
import useMultilingual from '@/hooks/useMultilingual';
import Clarification from '@/components/Clarification/Clarification';
import Coins from '../Coins/Coins';
import TokenCell from './TokenCell/TokenCell';
import { ToFixed } from '@/helpers/ToFixed';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import { ChainIcon } from '../ChainIcon/ChainIcon';
import { PuffLoader } from 'react-spinners';

export function Th({ column, onClick, sort }) {
  const { t } = useMultilingual('table');

  return (
    <td
      className={`${!column.asc ? style.desc : ''} ${column.borderRight ? style.borderRight : ''}`}
      onClick={() => sort && onClick()}
      rowSpan={column.rows}
      colSpan={column.columns}
    >
      <div className={style.headerCell}>
        {column?.translateName ? t(column.translateName) : column.name}
        {sort && <ArrowSort color={column.activated ? 'var(--arrowColor)' : 'var(--borderColor)'} />}
        {column?.helperText && (
          <span className={style.help}>
            <Clarification helperText={t(column.helperText)} stroke="var(--secondaryFont)" />
          </span>
        )}
      </div>
    </td>
  );
}

export function getDateFromTimeStamp(timestamp) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const dateTimeFormat = new Intl.DateTimeFormat('uk-Uk', options);
  if (timestamp) return dateTimeFormat.format(new Date(timestamp));
}

export function Td({ value, column, additionalStyle, isHaveDollarsTokens, onActionClick, onSetItClick }) {
  const {
    iconSize,
    additionalSymbolRight,
    additionalSymbolLeft,
    link,
    type,
    digitToRound,
    ifCheckTrueShowPrefix,
    isNotRound,
    withIcon,
    showTokenName,
  } = column;
  return (
    <>
      {type === ValueTypeEnum.DATE && <td className={style[additionalStyle]}>{getDateFromTimeStamp(value)}</td>}

      {type === ValueTypeEnum.NUMBER && (
        <td className={style[additionalStyle]}>
          <NumberFormat
            decimalScale={digitToRound}
            value={value}
            displayType="text"
            thousandSeparator
            prefix={`${
              isHaveDollarsTokens && ifCheckTrueShowPrefix ? ifCheckTrueShowPrefix : additionalSymbolLeft || ''
            }`}
            suffix={`${additionalSymbolRight || ''}`}
          />
        </td>
      )}

      {type === ValueTypeEnum.LINK && <td className={style[additionalStyle]}>{link(value)}</td>}

      {type === ValueTypeEnum.STRING && (
        <td className={style[additionalStyle] || ''}>
          {additionalSymbolLeft || ''}
          {value}
          {additionalSymbolRight || ''}
        </td>
      )}

      {type === ValueTypeEnum.CHAINS && (
        <td className={style[additionalStyle] || ''}>
          <div className={style.chains}>
            {value === null &&
              new Array(6).fill(0).map((_, index) => <PuffLoader size={22} color={'var(--borderColor)'} key={index} />)}
            {Array.isArray(value) &&
              (value.length === 0 ? (
                <div className={style.chainNotAvailable}>Not available at bitoftrade</div>
              ) : (
                value.map(chainId => <ChainIcon chainId={chainId} key={chainId} />)
              ))}
          </div>
        </td>
      )}

      {type === ValueTypeEnum.BOOLEAN && (
        <td className={style[additionalStyle] || ''}>
          {additionalSymbolLeft || ''}
          {String(value)}
          {additionalSymbolRight || ''}
        </td>
      )}

      {type === ValueTypeEnum.TOKEN && (
        <td className={`${style[additionalStyle] || ''}`}>
          <TokenCell
            tokenValue={value}
            config={{
              iconSize,
              isNotRound,
              isHaveDollarsTokens,
              digitToRound,
              ifCheckTrueShowPrefix,
              additionalSymbolLeft,
              additionalSymbolRight,
              withIcon,
              showTokenName,
            }}
          />
        </td>
      )}

      {type === ValueTypeEnum.PAIR && (
        <td className={`${style[additionalStyle] || ''}`}>
          <Coins textOnly={false} coinsNames={value} size={32} />
        </td>
      )}

      {type === ValueTypeEnum.ACTION && (
        <td className={`${style.actionStyle} ${style[additionalStyle] || ''}`}>
          <div
            className={style.actionButton}
            onClick={e => {
              e.stopPropagation();
              onActionClick();
            }}
          >
            {value}
          </div>
        </td>
      )}

      {type === ValueTypeEnum.PL_ACTION && (
        <td className={`${style.plActionStyle} ${style[additionalStyle] || ''}`}>
          <NumberFormat
            value={!isNotRound ? ToFixed(value, '', digitToRound) : Number(value)}
            displayType="text"
            thousandSeparator
            prefix={`${
              isHaveDollarsTokens && ifCheckTrueShowPrefix ? ifCheckTrueShowPrefix : additionalSymbolLeft || ''
            }`}
            suffix={`${additionalSymbolRight || ''}`}
          />
          <ButtonSimple className={style.setItButton} size={'small'} color={'dark'} onClick={() => onSetItClick()}>
            {'Set It'}
          </ButtonSimple>
          {/*<div className={style.grow} />*/}
        </td>
      )}
    </>
  );
}

export function SeeAll({ seeAllState, toggleState, colSpan }) {
  const toggleSeeAllState = () => toggleState(state => !state);
  return (
    <tr onClick={toggleSeeAllState}>
      <td colSpan={colSpan}>{seeAllState ? 'See all' : 'Hide all'}</td>
    </tr>
  );
}

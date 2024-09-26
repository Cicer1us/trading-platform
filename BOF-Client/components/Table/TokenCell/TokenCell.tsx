import React from 'react';
import style from './TokenCell.module.css';
import NumberFormat from 'react-number-format';
import useWindowSize from '@/hooks/useWindowSize';
import { TokenColumn } from '@/interfaces/TransactionTable.interface';
import CoinsImages from '@/components/CoinsImages/CoinsImages';
import getDecimalsScale from '@/helpers/getDecimalsScale';

interface TokenCellProps {
  tokenValue: TokenColumn;
  config: {
    isNotRound?: boolean;
    isHaveDollarsTokens?: boolean;
    digitToRound?: number;
    ifCheckTrueShowPrefix?: string;
    additionalSymbolLeft?: string;
    additionalSymbolRight?: string;
    withIcon?: boolean;
    showTokenName?: boolean;
    iconSize?: number;
  };
}

interface Size {
  width: number | undefined;
  height: number | undefined;
}

const TokenCell: React.FC<TokenCellProps> = ({ tokenValue, config }: TokenCellProps): JSX.Element => {
  const {
    isHaveDollarsTokens,
    ifCheckTrueShowPrefix,
    additionalSymbolLeft,
    additionalSymbolRight,
    withIcon,
    showTokenName,
    iconSize,
  } = config;

  const { symbol, logoURI, value, link } = tokenValue;
  const windowSize: Size = useWindowSize();

  const content = (
    <>
      {withIcon && (
        <CoinsImages uri={logoURI} symbol={symbol} size={iconSize ?? windowSize.width < 767 ? '24px' : '32px'} />
      )}
      {value && (
        <NumberFormat
          decimalScale={getDecimalsScale(value)}
          value={value}
          displayType="text"
          thousandSeparator
          prefix={`${
            isHaveDollarsTokens && ifCheckTrueShowPrefix ? ifCheckTrueShowPrefix : additionalSymbolLeft || ''
          }`}
          suffix={`${additionalSymbolRight || ''}`}
        />
      )}
      {showTokenName && <span>{symbol}</span>}
    </>
  );

  return (
    <>
      {link ? (
        <a
          className={style.wrapper}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          {content}
        </a>
      ) : (
        <div className={style.wrapper}>{content}</div>
      )}
    </>
  );
};

export default React.memo(TokenCell);

import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';
import React, { ReactNode } from 'react';
import style from './BlockList.module.css';
import NumberFormat from 'react-number-format';
import { LeverageMarketIcon } from '@/assets/icons/leverage/LeverageMarketIcon';

type ContentState = 'green' | 'white' | 'red';

interface BlockItemProps {
  title?: string;
  content?: string;
  button?: boolean;
  prefix?: string;
  suffix?: string;
  onClick?: () => void;
  contentState?: ContentState;
}
interface BlockTitleItemProps extends Omit<BlockItemProps, 'button'> {
  iconSymbols: string[];
  title: string;
}
interface BlockListProps {
  children: ReactNode;
}

export const BlockItem: React.FC<BlockItemProps> = ({
  title,
  onClick,
  content,
  contentState,
  button,
  prefix,
  suffix,
}: BlockItemProps) => {
  return (
    <div
      className={`${style.item} ${contentState ? style[contentState] : ''} ${button ? style.button : ''}`}
      onClick={onClick}
    >
      {title && <div className={style.title}>{title}</div>}
      {content && (
        <div className={style.content}>
          <NumberFormat value={content} displayType="text" thousandSeparator={true} prefix={prefix} suffix={suffix} />
        </div>
      )}
    </div>
  );
};

export const BlockTitleItem: React.FC<BlockTitleItemProps> = ({
  title,
  onClick,
  content,
  contentState,
  iconSymbols,
  prefix,
  suffix,
}: BlockTitleItemProps) => {
  return (
    <div className={`${style.item} ${contentState ? style[contentState] : ''}`}>
      <div className={style.blockTitle} onClick={onClick}>
        {!!iconSymbols?.length && (
          <div className={style.blockIcons}>
            {iconSymbols.map(symbol => (
              <div className={style.blockIcon} key={symbol}>
                <LeverageMarketIcon size={20} market={symbol} />
              </div>
            ))}
          </div>
        )}
        <div className={style.title}>{title}</div>
        <div className={style.dropDown}>
          <ArrowDropdownIcon stroke={'white'} />
        </div>
      </div>
      {content && (
        <div className={style.content}>
          <NumberFormat value={content} displayType="text" thousandSeparator={true} prefix={prefix} suffix={suffix} />
        </div>
      )}
    </div>
  );
};
export const BlockList: React.FC<BlockListProps> = ({ children }: BlockListProps) => {
  return <div className={`${style.list} scroll boxStyle`}>{children}</div>;
};

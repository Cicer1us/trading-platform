import React from 'react';
import style from './WidgetSelectButton.module.css';
import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';
import CoinsImages from '@/components/CoinsImages/CoinsImages';
import useWindowSize from '@/hooks/useWindowSize';
import { Chains } from 'connection/chainConfig';
import { ChainIcon } from '@/components/ChainIcon/ChainIcon';

interface Size {
  width: number | undefined;
  height: number | undefined;
}

interface WidgetSelectButtonProps {
  onClick: () => void;
  coinName: string;
  size?: string;
  coinSize?: string;
  coinSizeMobile?: string;
  chainId?: Chains;
}

const WidgetSelectButton: React.FC<WidgetSelectButtonProps> = ({
  onClick,
  coinName,
  size,
  coinSize = '32px',
  coinSizeMobile = '24px',
  chainId = null,
}: WidgetSelectButtonProps): JSX.Element => {
  const windowSize: Size = useWindowSize();
  return (
    <button type="button" onClick={onClick} className={`${style.wrapper} ${style[`${size}`]} `}>
      <div className={style.imageWrapper}>
        {chainId && <ChainIcon chainId={chainId} />}
        {coinName && <CoinsImages symbol={coinName} size={windowSize.width < 768 ? coinSizeMobile : coinSize} />}
        <p className={style.title}>{coinName}</p>
      </div>
      <div className={style.arrowWrapper}>
        <ArrowDropdownIcon />
      </div>
    </button>
  );
};

export default React.memo(WidgetSelectButton);

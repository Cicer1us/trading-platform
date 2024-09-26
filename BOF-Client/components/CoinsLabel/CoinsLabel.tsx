import React from 'react';
import style from './CoinsLabel.module.css';
import { LeverageMarketIcon } from '@/assets/icons/leverage/LeverageMarketIcon';

interface CoinsLabelProps {
  coinsNames: string;
  size?: number;
}

const CoinsLabel: React.FC<CoinsLabelProps> = ({ coinsNames, size = 20 }: CoinsLabelProps): JSX.Element => {
  const isMultipleName = coinsNames?.includes('/');
  return (
    <div className={style.wrapper}>
      {isMultipleName && (
        <div className={style.container}>
          <span className={style.cell}>
            <LeverageMarketIcon market={coinsNames?.split('/')[0]} size={size} />
          </span>
          <span className={style.cell}>
            <LeverageMarketIcon market={coinsNames?.split('/')[1]} size={size} />
          </span>
        </div>
      )}
      {!isMultipleName && <LeverageMarketIcon market={coinsNames} size={size} />}
    </div>
  );
};

export default React.memo(CoinsLabel);

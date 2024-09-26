import React from 'react';
import style from './Coins.module.css';
import CoinsLabel from '@/components/CoinsLabel/CoinsLabel';

interface CoinsProps {
  coinsNames: string;
  size?: number;
  textOnly: boolean;
}

const Coins: React.FC<CoinsProps> = ({ coinsNames, size = 20, textOnly = false }: CoinsProps): JSX.Element => {
  return (
    <div className={style.wrapper}>
      {textOnly ? '' : <CoinsLabel coinsNames={coinsNames} size={size} />}
      {coinsNames}
    </div>
  );
};

export default React.memo(Coins);

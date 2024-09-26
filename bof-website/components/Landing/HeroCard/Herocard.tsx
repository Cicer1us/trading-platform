import { TRADING_SWAP } from '@/common/LocationPath';
import React from 'react';
import Link from 'next/link';
import { ButtonSimple } from '../../Buttons/Buttons';
import style from './HeroCard.module.css';
import Card from '@/components/Card/Card';

const HeroCard = (): JSX.Element => {
  return (
    <>
      <Card className={style.wrapper}>
        <div className={style.content}>
          <h1 className={style.title}>
            Take control <br /> of your assets
          </h1>
          <h2 className={style.subtitle}>
            Utilize advanced crypto trading features and enjoy secure <br /> decentralized services without registration
          </h2>
          <div className={style.btn}>
            <Link href={TRADING_SWAP} target="_blank" rel="noopener noreferrer">
              <ButtonSimple className={style.btnH} color="green" size="small">
                Explore app
              </ButtonSimple>
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};

export default React.memo(HeroCard);

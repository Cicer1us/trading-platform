import React from 'react';
import style from './HeroTeam.module.css';
import Card from '@/components/Card/Card';

const HeroTeam = (): JSX.Element => {
  return (
    <>
      <Card className={style.wrapper}>
        <div className={style.content}>
          <h1 className={style.title}>Meet our team</h1>
          <h2 className={style.subtitle}>
            Our team is made up of blockchain industry leaders, business professionals,
            <br />
            engineers, and web developers. We are committed to making NFTs
            <br />
            mainstream and are working tirelessly to be at the forefront of the
            <br />
            technological revolution.
          </h2>
        </div>
      </Card>
    </>
  );
};

export default React.memo(HeroTeam);

import React from 'react';
import style from './Team.module.css';
import SubscribeEmail from '@/components/Subscribe/SubscribeEmail/SubscribeEmail';
import HeroTeam from '@/components/Team/HeroTeam/HeroTeam';
import MemberCards from '@/components/Team/memberCard/MemberCards';
import LandingFooter from 'components/Footer/Footer';

const Team = (): JSX.Element => {
  return (
    <>
      <div className={style.wrapper}>
        <section className={style.section}>
          <HeroTeam />
        </section>

        <section className={style.cardSection}>
          <h2 className={style.subtitle}>Сore Contributors</h2>
          <MemberCards />
        </section>

        <section className={style.FooterSection}>
          <SubscribeEmail />
          <LandingFooter />
        </section>
      </div>
    </>
  );
};

export default React.memo(Team);

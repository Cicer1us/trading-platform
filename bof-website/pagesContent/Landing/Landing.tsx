import React from 'react';
import style from './Landing.module.css';
import SubscribeEmail from 'components/Subscribe/SubscribeEmail/SubscribeEmail';
import MetaTags from 'components/MetaTags/MetaTags';
import Herocard from '@/components/Landing/HeroCard/Herocard';
import AchievementsList from '@/components/Landing/AchievementsList/AchievementsList';
import StatisticsCards from '@/components/Landing/StatisticsCards/StatisticsCards';
import Qualities from '@/components/Landing/Qualities/Qualities';
import SocialMediaList from '@/components/Landing/SocialMediaList/SocialMediaList';
import Products from '@/components/Landing/ProductsBlocks/Products';
import LandingFooter from 'components/Footer/Footer';
import CryptoPaymentBlock from '@/components/Landing/CryptoPaymentBlock/CryptoPaymentBlock';

const Landing = (): JSX.Element => {
  return (
    <>
      <MetaTags
        title={'bitoftrade | Crypto Trading Platform'}
        description={
          'Utilize advanced crypto trading features and enjoy secure decentralized services without registration.'
        }
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.com`}
      />

      <div className={style.wrapper}>
        <section className={style.heroSection}>
          <Herocard />
        </section>

        <section className={style.achievementsSection}>
          <AchievementsList />
        </section>

        <section className={style.heroSection}>
          <CryptoPaymentBlock />
        </section>

        <section className={style.productsSection}>
          <Products />
        </section>

        <section className={style.statisticsSection}>
          <StatisticsCards />
        </section>

        <section className={`${style.whyusSection} ${style.whyUsGradient}`}>
          <Qualities />
        </section>

        <section className={style.smSection}>
          <SocialMediaList />
        </section>

        <section className={style.FooterSection}>
          <SubscribeEmail />
          <LandingFooter />
        </section>
      </div>
    </>
  );
};

export default React.memo(Landing);

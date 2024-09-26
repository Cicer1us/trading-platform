import React from 'react';
import style from './Blog.module.css';
import SubscribeEmail from 'components/Subscribe/SubscribeEmail/SubscribeEmail';
import Categories from './Categories/Categories';
import TopFourArticles from './TopFourArticles/TopFourArticles';
import MetaTags from 'components/MetaTags/MetaTags';
import Card from '@/components/Card/Card';
import LandingFooter from 'components/Footer/Footer';

interface BlogProps {
  articles: any;
  blogFourArticles?: any;
  allArticles?: any;
  sortedArallArticlesticles?: any;
  allLabels?: string[];
  blogTitle?: string;
  totalArticles: number;
}

const Blog = ({ articles, blogFourArticles, allLabels }: BlogProps): JSX.Element => {
  return (
    <>
      <MetaTags
        title={'bitoftrade blog - No KYC Crypto Exchange'}
        description={
          'Stay looped in on the latest updates and discover the hottest crypto market insights from the revolutionary non-custodial crypto exchange.'
        }
        image={``}
        url={`https://bitoftrade.com/blog`}
      />

      <div className={style.wrapper}>
        <section className={`${style.section}`}>
          <Card className={style.card}>
            <div className={style.wrap}>
              <div className={style.sectionHeader}>
                <h1 className={style.sectionTitle}>{'bitoftrade Blog'}</h1>
              </div>
              <TopFourArticles blogFourArticles={blogFourArticles} />
            </div>
          </Card>
        </section>

        <section className={style.sectionArticles}>
          <Categories categories={allLabels} articles={articles} />
        </section>

        <section className={style.FooterSection}>
          <SubscribeEmail
            title={'Exciting developments and updates are coming to bitoftrade. Be the first to know!'}
            buttonName={'Subscribe'}
            enterYourEmail={'Enter You Email'}
          />
          <LandingFooter />
        </section>
      </div>
    </>
  );
};

export default React.memo(Blog);

import React, { useEffect, useState } from 'react';
import style from './Article.module.css';
import SubscribeEmail from 'components/Subscribe/SubscribeEmail/SubscribeEmail';
import BlogCard from 'pagesContent/Blog/BlogCard/BlogCard';
import Content from './Content/Content';
import dayjs from 'dayjs';
import Link from 'next/link';
import { BLOG } from '@/common/LocationPath';
import { Crumbs } from '@/components/Crums/Crumbs';

interface ArticleProps {
  article: any;
  allArticles: any;
}

const getRandomArticles = (currentArticle, allArticles) => {
  // remove current page article from list and randomly sort
  return allArticles.filter(art => art.title !== currentArticle.fields.title).sort(() => 0.5 - Math.random());
};

const Article: React.FC<ArticleProps> = ({ article, allArticles }): JSX.Element => {
  const [relatedArticles, setRelatedArticles] = useState(allArticles);
  const {
    sys: { updatedAt },
    fields,
  } = article;

  useEffect(() => {
    setRelatedArticles(getRandomArticles(article, allArticles));
  }, []);

  const crumbs = [
    {
      title: 'Blog',
      link: `${BLOG}`,
    },
    {
      title: 'Article',
      link: ``,
    },
  ];

  return (
    <>
      <div className={style.wrapper}>
        <Crumbs crumbs={crumbs} />
        <section className={style.section}>
          <div className={`${style.sectionHeader} ${style.sectionHeader_data}`}>
            <span>{'Article'}</span>
            <div className={style.divider} />
            <span>{dayjs(updatedAt).format('MMMM DD, YYYY')}</span>
          </div>
          <h1 className={style.sectionTitle}>{fields.title}</h1>
        </section>

        <div className={style.wrapperImage}>
          <img src={`https:${fields?.cover?.fields?.file?.url}`} alt="Image" className={style.image} />
        </div>

        <section className={style.section}>
          <div className={style.sectionContainer}>
            <Content content={fields?.body} />
          </div>
        </section>

        <section className={style.section}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionSubTitle}>{'Related Posts'}</h2>

            <Link href={BLOG} className={style.link}>
              {'Browse All Articles'}
            </Link>
          </div>

          <div className={style.sectionGrid}>
            {!!relatedArticles?.length &&
              relatedArticles
                .slice(0, 2)
                .map(({ imgUrl, title, date, linkPath }, index) => (
                  <BlogCard
                    key={index}
                    imgUrl={imgUrl}
                    title={title}
                    date={date}
                    linkPath={linkPath}
                    type={'standard'}
                  />
                ))}
            {!relatedArticles?.length && <span>{'List is empty'}</span>}
          </div>
        </section>

        <section className={style.section}>
          <SubscribeEmail
            title={'Exciting developments and updates are coming to bitoftrade Be the first to know.'}
            buttonName="Subscribe"
            enterYourEmail="Enter your email"
          />
        </section>
      </div>
    </>
  );
};

export default React.memo(Article);

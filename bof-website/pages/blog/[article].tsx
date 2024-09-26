import React from 'react';
import { GetStaticProps } from 'next';
import Article from 'pagesContent/Article/Article';
import client from 'helpers/contentful';
import dayjs from 'dayjs';
import Head from 'next/head';
import MetaTags from '@/components/MetaTags/MetaTags';
import parse from 'html-react-parser';
import WideLayout from '@/layouts/WideLayout/WideLayout';
export interface ModifyArticles {
  imgUrl: string;
  title: string;
  date: string;
  linkPath: string;
}

const ArticlePage: React.FC<any> = ({ article, parsedArticles }: any): JSX.Element => {
  if (!article) {
    console.error("couldn't fetch article", article);
    return <>Couldn't fetch data for article {JSON.stringify(article)}</>;
  }
  const articleTitle = article.fields.seoTitle || 'bitoftrade';
  const articleDescription = article.fields.seoDescription || '';

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bitoftrade.com/blog/${article.fields.slug}`,
    },
    headline: articleTitle,
    image: [`https:${article.fields.cover.fields.file.url}`],
    datePublished: article.sys.createdAt,
    dateModified: article.sys.updatedAt,
    author: { '@type': 'Person', name: 'bitoftrade' },
    publisher: {
      '@type': 'Organization',
      name: 'bitoftrade',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bitoftrade.com/images/bitoftrade-logo.png',
      },
    },
    description: articleDescription,
  };
  return (
    <>
      <Head>
        {parse(`
      <script type="application/ld+json">
        ${JSON.stringify(articleStructuredData)}
      </script>
    `)}
      </Head>
      <MetaTags
        title={articleTitle}
        description={articleDescription}
        image={`https:${article.fields?.cover?.fields?.file?.url}`}
        url={`https://bitoftrade.com/blog/${article.fields?.slug}`}
        content={'article'}
      />

      <WideLayout>
        <Article article={article} allArticles={parsedArticles} />
      </WideLayout>
    </>
  );
};

export default React.memo(ArticlePage);

// TODO: add change languages
export const getStaticPaths = async () => {
  const articlesEntries = await client.getEntries<any>({
    content_type: 'articles',
    select: ['fields'],
  });

  const temp = {
    paths: articlesEntries.items.map(item => {
      return { params: { article: item.fields.slug } };
    }),
    fallback: true,
  };
  return temp;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.article || '';
  let parsedArticles: Array<ModifyArticles> = [];

  const allArticles = await client.getEntries<any>({ content_type: 'articles' });

  const articlesEntries = await client.getEntries({
    content_type: 'articles',
    limit: 1,
    'fields.slug': slug,
  });

  if (articlesEntries.items?.length) {
    parsedArticles = allArticles.items.map(({ fields, sys: { createdAt } }) => {
      const date = dayjs(createdAt).format('MMMM DD, YYYY');

      return {
        imgUrl: `https:${fields?.cover?.['fields']?.file?.url}`,
        title: fields.title as string,
        date,
        linkPath: `/blog/${fields.slug}`,
      };
    });
  }

  const [article] = articlesEntries.items;

  // revalidate every 4 hours
  return { props: { article, parsedArticles }, revalidate: 60 * 60 * 4 };
};

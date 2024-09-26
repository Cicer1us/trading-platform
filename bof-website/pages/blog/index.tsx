import React from 'react';
import { GetStaticProps } from 'next';
import Blog from 'pagesContent/Blog/Blog';
import { client } from '@/helpers/contentful';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import WideLayout from '@/layouts/WideLayout/WideLayout';

export interface ModifyArticles {
  imgUrl: string;
  title: string;
  date: string;
  linkPath: string;
}

function BlogPage({ articles, blogTitle, blogFourArticles, totalArticles, allLabels }: any) {
  return (
    <WideLayout>
      <Blog
        articles={articles}
        blogFourArticles={blogFourArticles}
        blogTitle={blogTitle}
        totalArticles={totalArticles}
        allLabels={allLabels}
      />
    </WideLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const language = locale === 'ru' ? 'ru' : 'en-US';
  const contentTypeArticles = await client.getContentType('articles');
  const labels = contentTypeArticles.fields.find(({ id }) => id === 'label').items.validations[0].in || [];

  const articlesEntries = await client.getEntries<any>({
    content_type: 'articles',
    locale: language,
    order: ['-sys.createdAt'],
  });
  const blogPage = await client.getEntries<any>({ content_type: 'blogPage', locale: language });

  let modify: Array<ModifyArticles> = [];

  if (articlesEntries.items?.length) {
    modify = articlesEntries.items.map(({ fields, sys: { createdAt } }) => {
      const date =
        locale === 'ru'
          ? dayjs(createdAt).locale(ru).format('MMMM DD, YYYY')
          : dayjs(createdAt).format('MMMM DD, YYYY');

      const category = (fields.label as string[])?.pop().replace(/\s+/g, '-').toLowerCase();
      return {
        imgUrl: `https:${fields?.cover?.['fields']?.file?.url}`,
        thumbnailImg: `https:${fields?.thumbnailImage?.['fields']?.file?.url}`,
        title: fields.title as string,
        date,
        linkPath: `/blog/${fields.slug}`,
        categoryType: category,
      };
    });
  }
  return {
    props: {
      articles: modify,
      blogTitle: blogPage?.items[0]?.fields?.blogTitle,
      blogFourArticles: modify.slice(0, 4),
      totalArticles: articlesEntries?.total,
      allLabels: labels,
    },
    revalidate: 60 * 30,
  };
};

export default BlogPage;

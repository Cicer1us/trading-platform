import MetaTags from '@/components/MetaTags/MetaTags';
import React from 'react';
import Terms from 'pagesContent/Terms/Terms';
import { GetStaticProps } from 'next';
import client from '@/helpers/contentful';
import WideLayout from '@/layouts/WideLayout/WideLayout';

const TermsPage = ({ cmsData }) => {
  const { seoTitle, seoDescription, termsContent } = cmsData;
  return (
    <>
      <MetaTags
        title={seoTitle}
        description={seoDescription}
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.come/terms`}
      />

      <div>
        <WideLayout>
          <Terms cmsData={termsContent} />
        </WideLayout>
      </div>
    </>
  );
};
export default TermsPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const language = locale === 'ru' ? 'ru' : 'en-US';
  const cmsDataResponse = await client.getEntries({ content_type: 'termsOfService', locale: language });
  return { props: { cmsData: cmsDataResponse.items[0].fields }, revalidate: 60 * 60 * 4 };
};

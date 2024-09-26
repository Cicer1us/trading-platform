import React from 'react';
import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  image: string;
  url: string;
  content?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image,
  url,
  content = 'website',
}: MetaTagsProps): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:site_name" content="bitoftrade" />
      <meta name="description" content={description} />
      <meta property="og:type" content={content} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:card" content={'summary_large_image'} />
      <link rel="canonical" href={url} />
      <link rel="alternate" href={url} hrefLang="x-default" />
      <link rel="alternate" href={url} hrefLang="en" />
    </Head>
  );
};

export default MetaTags;

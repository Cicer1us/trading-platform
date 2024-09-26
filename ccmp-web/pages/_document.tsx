import Document, { Html, Head, Main, NextScript } from 'next/document';
import parse from 'html-react-parser';

const companyStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://bitoftrade.com',
      name: 'bitoftrade - No KYC Crypto Exchange',
      url: 'https://bitoftrade.com',
      legalName: 'bitoftrade',
      foundingDate: '2022',
      founders: [
        {
          '@type': 'Person',
          name: 'Alex', // TODO: change to real
        },
      ],
      sameAs: [
        'https://t.me/bitoftradeOfficial',
        'https://t.me/bitoftradeRussia',
        'https://vk.com/bitoftrade',
        'https://www.linkedin.com/company/bitoftrade',
        'https://twitter.com/bitoftrade',
      ],
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://bitoftrade.com',
        url: '/images/bitoftrade-logo.png',
        caption: 'bitoftrade - No KYC Crypto Exchange',
      },
      image: { '@id': 'https://bitoftrade.com' },
    },
  ],
};

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="//unpkg.com/@ungap/global-this" />
          <script src="/static/tradingview/datafeeds/udf/dist/polyfills.js"></script>
          <script src="/static/tradingview/datafeeds/udf/dist/bundle.js"></script>
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#0b0e0f" />
          <meta name="robots" content="index, follow" />

          {parse(`
            <script type="application/ld+json">
              ${JSON.stringify(companyStructuredData)}
            </script>

          `)}
        </Head>
        <body className="scroll">
          <Main />
          <div id="portal" className="AppLayout" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

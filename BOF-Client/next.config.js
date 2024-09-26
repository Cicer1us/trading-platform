const withImages = require('next-images');

module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',

    /**
     *  Next.js will automatically detect which locale the user prefers
     *  based on the Accept-Language header sent in the page request.
     *
     *  This behaviour can be disabled by setting
     *  localeDetection to false in your i18n options.
     */
    // localeDetection: false
  },
  ...withImages(),
  images: {
    domains: ['s2.coinmarketcap.com', 'images.ctfassets.net'],
  },
  async rewrites() {
    return [
      {
        source: '/usa-trading.html',
        destination: '/usa-trading',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/:category/:article',
        destination: '/blog/:article',
        permanent: true,
      },
    ];
  },
};

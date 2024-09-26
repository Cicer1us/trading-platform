const withImages = require('next-images');

module.exports = {
  ...withImages(),
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
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

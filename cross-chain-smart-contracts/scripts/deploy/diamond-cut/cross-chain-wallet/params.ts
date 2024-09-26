import { FacetDeployArgs } from '../utils';

const walletFacetsDeployArgs: FacetDeployArgs = {
  [1]: [
    {
      facetName: 'SignersRegistryFacet',
      initMethod: 'setSignersRegistry',
      initArgs: ['0x84afd473aEb4f6E8b8d6e57a3d9F9D85709fceBa'],
    },
    {
      facetName: 'WalletSwapProvidersFacet',
      initMethod: 'addWhitelistedSwapProvider',
      initArgs: ['0xdef171fe48cf0115b1d80b88dc8eab59176fee57'],
    },
    {
      facetName: 'CrossChainRoutersFacet',
      initMethod: 'addCrossChainRouters',
      initArgs: [
        [
          { chainId: '137', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
          { chainId: '56', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
          { chainId: '1', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
        ],
      ],
    },
    {
      facetName: 'ConnectorTokensDecimalsFacet',
      initMethod: 'addWhitelistedConnectorTokenDecimals',
      initArgs: [
        [
          { chainId: '1', token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: '6' },
          { chainId: '56', token: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', decimals: '18' },
          { chainId: '137', token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', decimals: '6' },
        ],
      ],
    },
  ],
  [56]: [
    {
      facetName: 'SignersRegistryFacet',
      initMethod: 'setSignersRegistry',
      initArgs: ['0x84afd473aEb4f6E8b8d6e57a3d9F9D85709fceBa'],
    },
    {
      facetName: 'WalletSwapProvidersFacet',
      initMethod: 'addWhitelistedSwapProvider',
      initArgs: ['0xdef171fe48cf0115b1d80b88dc8eab59176fee57'],
    },
    {
      facetName: 'CrossChainRoutersFacet',
      initMethod: 'addCrossChainRouters',
      initArgs: [
        [
          { chainId: '137', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
          { chainId: '56', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
          { chainId: '1', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
        ],
      ],
    },
    {
      facetName: 'ConnectorTokensDecimalsFacet',
      initMethod: 'addWhitelistedConnectorTokenDecimals',
      initArgs: [
        [
          { chainId: '1', token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: '6' },
          { chainId: '56', token: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', decimals: '18' },
          { chainId: '137', token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', decimals: '6' },
        ],
      ],
    },
  ],
  [137]: [
    {
      facetName: 'SignersRegistryFacet',
      initMethod: 'setSignersRegistry',
      initArgs: ['0x3E0387bDcCe1b2A416700FC075f8c33c3A5f7E07'],
    },
    {
      facetName: 'WalletSwapProvidersFacet',
      initMethod: 'addWhitelistedSwapProvider',
      initArgs: ['0xdef171fe48cf0115b1d80b88dc8eab59176fee57'],
    },
    {
      facetName: 'CrossChainRoutersFacet',
      initMethod: 'addCrossChainRouters',
      initArgs: [
        [
          { chainId: '137', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
          { chainId: '56', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
          { chainId: '1', router: '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03' },
        ],
      ],
    },
    {
      facetName: 'ConnectorTokensDecimalsFacet',
      initMethod: 'addWhitelistedConnectorTokenDecimals',
      initArgs: [
        [
          { chainId: '1', token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: '6' },
          { chainId: '56', token: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', decimals: '18' },
          { chainId: '137', token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', decimals: '6' },
        ],
      ],
    },
  ],
};

export default walletFacetsDeployArgs;

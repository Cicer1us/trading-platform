import { FacetDeployArgs } from '../utils';

const routerFacetsDeployArgs: FacetDeployArgs = {
  [56]: [
    {
      facetName: 'RouterSwapProvidersFacet',
      initMethod: 'addWhitelistedSwapProvider',
      initArgs: ['0xdef171fe48cf0115b1d80b88dc8eab59176fee57'],
    },
    {
      facetName: 'ConnectorTokensFacet',
      initMethod: 'addWhitelistedConnectorToken',
      initArgs: ['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'],
    },
    {
      facetName: 'MultichainConnectorTokensFacet',
      initMethod: 'addMultichainConnectorToken',
      initArgs: ['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2'],
    },
    {
      facetName: 'MultichainRoutersFacet',
      initMethod: 'addWhitelistedMultichainRouter',
      initArgs: ['0xd1C5966f9F5Ee6881Ff6b261BBeDa45972B1B5f3'],
    },
  ],
  [137]: [
    {
      facetName: 'RouterSwapProvidersFacet',
      initMethod: 'addWhitelistedSwapProvider',
      initArgs: ['0xdef171fe48cf0115b1d80b88dc8eab59176fee57'],
    },
    {
      facetName: 'ConnectorTokensFacet',
      initMethod: 'addWhitelistedConnectorToken',
      initArgs: ['0x2791bca1f2de4661ed88a30c99a7a9449aa84174'],
    },
    {
      facetName: 'MultichainConnectorTokensFacet',
      initMethod: 'addMultichainConnectorToken',
      initArgs: ['0x2791bca1f2de4661ed88a30c99a7a9449aa84174', '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'],
    },
    {
      facetName: 'MultichainRoutersFacet',
      initMethod: 'addWhitelistedMultichainRouter',
      initArgs: ['0x4f3Aff3A747fCADe12598081e80c6605A8be192F'],
    },
  ],
};

export default routerFacetsDeployArgs;

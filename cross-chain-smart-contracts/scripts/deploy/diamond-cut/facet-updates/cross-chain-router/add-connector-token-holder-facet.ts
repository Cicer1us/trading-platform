import { deployFacetWithInitData } from '../../utils';

interface ConnectorTokenHolderArgs {
  holder: string;
  chainId: string;
}

const diamondAddress = '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03';
const connectorTokenHolders: ConnectorTokenHolderArgs[] = [
  {
    holder: '0x6d569eA24622540a63D589C10d5Ba899f8731409',
    chainId: '56',
  },
  {
    holder: '0x6d569eA24622540a63D589C10d5Ba899f8731409',
    chainId: '137',
  },
];

const main = async () => {
  await deployFacetWithInitData(diamondAddress, 'ConnectorTokenHolderFacet', 'addConnectorTokenHolders', [
    connectorTokenHolders,
  ]);
};

main();

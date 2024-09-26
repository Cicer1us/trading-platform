import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { ConnectorTokenHolderFacet, ConnectorTokenHolderFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';
import { ZERO_ADDRESS } from '../../../utils/constants';

describe('ConnectorTokenHolderFacet', async () => {
  async function deployConnectorTokenHolderFacet() {
    const [owner, someUser, connectorTokenHolder1, connectorTokenHolder2] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'ConnectorTokenHolderFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const connectorTokenHolderFacet = ConnectorTokenHolderFacet__factory.connect(crossChainRouter.address, owner);

    const holders: ConnectorTokenHolderFacet.ConnectorTokenHolderArgsStruct[] = [
      {
        holder: connectorTokenHolder1.address,
        chainId: 1,
      },
      {
        holder: connectorTokenHolder2.address,
        chainId: 56,
      },
    ];

    return {
      owner,
      someUser,
      holders,
      connectorTokenHolder1,
      connectorTokenHolder2,
      connectorTokenHolderFacet,
    };
  }

  it('addConnectorTokenHolders should fail due to non owner caller', async () => {
    const { someUser, connectorTokenHolderFacet, holders } = await loadFixture(deployConnectorTokenHolderFacet);
    await expect(connectorTokenHolderFacet.connect(someUser).addConnectorTokenHolders(holders)).to.be.revertedWith(
      'LibDiamond: Must be contract owner'
    );
  });

  it('addConnectorTokenHolders should successfully add new connector token holders', async () => {
    const { owner, connectorTokenHolderFacet, holders, connectorTokenHolder1, connectorTokenHolder2 } =
      await loadFixture(deployConnectorTokenHolderFacet);

    await connectorTokenHolderFacet.connect(owner).addConnectorTokenHolders(holders);

    expect(await connectorTokenHolderFacet.connectorTokenHolder(1)).to.be.equal(connectorTokenHolder1.address);
    expect(await connectorTokenHolderFacet.connectorTokenHolder(56)).to.be.equal(connectorTokenHolder2.address);
  });

  it('removeConnectorTokenHolder should fail due to non owner caller', async () => {
    const { someUser, connectorTokenHolderFacet } = await loadFixture(deployConnectorTokenHolderFacet);

    await expect(connectorTokenHolderFacet.connect(someUser).removeConnectorTokenHolder(1)).to.be.revertedWith(
      'LibDiamond: Must be contract owner'
    );
  });

  it('removeConnectorTokenHolder should successfully remove connector token holder', async () => {
    const { owner, connectorTokenHolderFacet, holders, connectorTokenHolder1 } = await loadFixture(
      deployConnectorTokenHolderFacet
    );

    await connectorTokenHolderFacet.connect(owner).addConnectorTokenHolders(holders);
    expect(await connectorTokenHolderFacet.connectorTokenHolder(1)).to.be.equal(connectorTokenHolder1.address);
    await connectorTokenHolderFacet.connect(owner).removeConnectorTokenHolder(1);
    expect(await connectorTokenHolderFacet.connectorTokenHolder(1)).to.be.equal(ZERO_ADDRESS);
  });

  it('connectorTokenHolder return zero address as connector token holder not registered yet', async () => {
    const { connectorTokenHolderFacet } = await loadFixture(deployConnectorTokenHolderFacet);

    expect(await connectorTokenHolderFacet.connectorTokenHolder(1)).to.be.equal(ZERO_ADDRESS);
  });
});

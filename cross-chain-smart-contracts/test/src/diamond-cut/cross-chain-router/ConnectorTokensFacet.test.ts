import { usdcToken, connectorTokens } from '@bitoftrade/cross-chain-core';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { ConnectorTokensFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';

describe('ConnectorTokensFacet', async () => {
  async function deployConnectorTokensFacet() {
    const [owner, someUser] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'ConnectorTokensFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const connectorTokensFacet = ConnectorTokensFacet__factory.connect(crossChainRouter.address, owner);

    return {
      owner,
      someUser,
      connectorTokensFacet,
    };
  }

  it('addWhitelistedConnectorToken should fail due to non owner caller', async () => {
    const { someUser, connectorTokensFacet } = await loadFixture(deployConnectorTokensFacet);
    await expect(
      connectorTokensFacet
        .connect(someUser)
        .addWhitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addWhitelistedConnectorToken should successfully add new connector token', async () => {
    const { owner, connectorTokensFacet } = await loadFixture(deployConnectorTokensFacet);

    await connectorTokensFacet
      .connect(owner)
      .addWhitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address);

    expect(
      await connectorTokensFacet.whitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address)
    ).to.be.equal(true);
  });

  it('removeWhitelistedConnectorToken should fail due to non owner caller', async () => {
    const { someUser, connectorTokensFacet } = await loadFixture(deployConnectorTokensFacet);

    await expect(
      connectorTokensFacet
        .connect(someUser)
        .removeWhitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('removeWhitelistedConnectorToken should successfully remove connector token', async () => {
    const { owner, connectorTokensFacet } = await loadFixture(deployConnectorTokensFacet);

    await connectorTokensFacet
      .connect(owner)
      .addWhitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address);

    expect(
      await connectorTokensFacet.whitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address)
    ).to.be.equal(true);

    await connectorTokensFacet
      .connect(owner)
      .removeWhitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address);

    expect(
      await connectorTokensFacet.whitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address)
    ).to.be.equal(false);
  });

  it('whitelistedConnectorToken should return false as connector token is not registered yet', async () => {
    const { connectorTokensFacet } = await loadFixture(deployConnectorTokensFacet);

    expect(
      await connectorTokensFacet.whitelistedConnectorToken(connectorTokens[1][usdcToken[1].address].address)
    ).to.be.equal(false);
  });
});

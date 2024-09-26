import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { connectorTokens, usdcToken } from '@bitoftrade/cross-chain-core';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { MultichainConnectorTokensFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';
import { ZERO_ADDRESS } from '../../../utils/constants';

describe('MultichainConnectorTokensFacet', async () => {
  async function deployMultichainConnectorTokensFacet() {
    const [owner, someUser, connectorTokenHolder1, connectorTokenHolder2] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = [
      'DiamondCutFacet',
      'DiamondLoupeFacet',
      'OwnershipFacet',
      'MultichainConnectorTokensFacet',
    ];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const multichainConnectorTokensFacet = MultichainConnectorTokensFacet__factory.connect(
      crossChainRouter.address,
      owner
    );

    const multichainFacetArgs = {
      connectorToken: connectorTokens[1][usdcToken[1].address].address,
      multichainAnyToken: '0x7EA2be2df7BA6E54B1A9C70676f668455E329d29',
    };

    return {
      owner,
      someUser,
      multichainFacetArgs,
      connectorTokenHolder1,
      connectorTokenHolder2,
      multichainConnectorTokensFacet,
    };
  }

  it('addMultichainConnectorToken should fail due to non owner caller', async () => {
    const { someUser, multichainConnectorTokensFacet, multichainFacetArgs } = await loadFixture(
      deployMultichainConnectorTokensFacet
    );
    await expect(
      multichainConnectorTokensFacet
        .connect(someUser)
        .addMultichainConnectorToken(multichainFacetArgs.connectorToken, multichainFacetArgs.multichainAnyToken)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addMultichainConnectorToken should successfully add new multichain connector token', async () => {
    const { owner, multichainConnectorTokensFacet, multichainFacetArgs } = await loadFixture(
      deployMultichainConnectorTokensFacet
    );

    await multichainConnectorTokensFacet
      .connect(owner)
      .addMultichainConnectorToken(multichainFacetArgs.connectorToken, multichainFacetArgs.multichainAnyToken);

    expect(
      await multichainConnectorTokensFacet.multichainConnectorToken(multichainFacetArgs.connectorToken)
    ).to.be.equal(multichainFacetArgs.multichainAnyToken);
  });

  it('removeMultichainConnectorToken should fail due to non owner caller', async () => {
    const { someUser, multichainConnectorTokensFacet, multichainFacetArgs } = await loadFixture(
      deployMultichainConnectorTokensFacet
    );

    await expect(
      multichainConnectorTokensFacet
        .connect(someUser)
        .removeMultichainConnectorToken(multichainFacetArgs.connectorToken)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('removeMultichainConnectorToken should successfully remove multichain connector token', async () => {
    const { owner, multichainConnectorTokensFacet, multichainFacetArgs } = await loadFixture(
      deployMultichainConnectorTokensFacet
    );

    await multichainConnectorTokensFacet
      .connect(owner)
      .addMultichainConnectorToken(multichainFacetArgs.connectorToken, multichainFacetArgs.multichainAnyToken);

    expect(
      await multichainConnectorTokensFacet.multichainConnectorToken(multichainFacetArgs.connectorToken)
    ).to.be.equal(multichainFacetArgs.multichainAnyToken);

    await multichainConnectorTokensFacet
      .connect(owner)
      .removeMultichainConnectorToken(multichainFacetArgs.connectorToken);

    expect(
      await multichainConnectorTokensFacet.multichainConnectorToken(multichainFacetArgs.connectorToken)
    ).to.be.equal(ZERO_ADDRESS);
  });

  it('multichainConnectorToken should return false as multichain connector token is not registered yet', async () => {
    const { multichainConnectorTokensFacet, multichainFacetArgs } = await loadFixture(
      deployMultichainConnectorTokensFacet
    );

    expect(
      await multichainConnectorTokensFacet.multichainConnectorToken(multichainFacetArgs.connectorToken)
    ).to.be.equal(ZERO_ADDRESS);
  });
});

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { MultichainRoutersFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';

describe('MultichainRoutersFacet', async () => {
  async function deployMultichainRoutersFacet() {
    const [owner, someUser, multichainRouter] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'MultichainRoutersFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const multichainRoutersFacet = MultichainRoutersFacet__factory.connect(crossChainRouter.address, owner);

    return {
      owner,
      someUser,
      multichainRouter,
      multichainRoutersFacet,
    };
  }

  it('addWhitelistedMultichainRouter should fail due to non owner caller', async () => {
    const { someUser, multichainRoutersFacet, multichainRouter } = await loadFixture(deployMultichainRoutersFacet);
    await expect(
      multichainRoutersFacet.connect(someUser).addWhitelistedMultichainRouter(multichainRouter.address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addWhitelistedMultichainRouter should successfully add new multichain router', async () => {
    const { owner, multichainRoutersFacet, multichainRouter } = await loadFixture(deployMultichainRoutersFacet);

    await multichainRoutersFacet.connect(owner).addWhitelistedMultichainRouter(multichainRouter.address);

    expect(await multichainRoutersFacet.whitelistedMultichainRouter(multichainRouter.address)).to.be.equal(true);
  });

  it('removeWhitelistedMultichainRouter should fail due to non owner caller', async () => {
    const { someUser, multichainRoutersFacet, multichainRouter } = await loadFixture(deployMultichainRoutersFacet);

    await expect(
      multichainRoutersFacet.connect(someUser).removeWhitelistedMultichainRouter(multichainRouter.address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('removeWhitelistedMultichainRouter should successfully remove multichain router', async () => {
    const { owner, multichainRoutersFacet, multichainRouter } = await loadFixture(deployMultichainRoutersFacet);

    await multichainRoutersFacet.connect(owner).removeWhitelistedMultichainRouter(multichainRouter.address);

    expect(await multichainRoutersFacet.whitelistedMultichainRouter(multichainRouter.address)).to.be.equal(false);
  });

  it('whitelistedMultichainRouter should return false as multichain router is not registered yet', async () => {
    const { multichainRoutersFacet, multichainRouter } = await loadFixture(deployMultichainRoutersFacet);

    expect(await multichainRoutersFacet.whitelistedMultichainRouter(multichainRouter.address)).to.be.equal(false);
  });
});

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { RouterSwapProvidersFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';

describe('RouterSwapProvidersFacet', async () => {
  async function deployRouterSwapProvidersFacet() {
    const [owner, someUser, swapProvider] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'RouterSwapProvidersFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const routerSwapProvidersFacet = RouterSwapProvidersFacet__factory.connect(crossChainRouter.address, owner);

    return {
      owner,
      someUser,
      swapProvider,
      routerSwapProvidersFacet,
    };
  }

  it('addWhitelistedSwapProvider should fail due to non owner caller', async () => {
    const { someUser, routerSwapProvidersFacet, swapProvider } = await loadFixture(deployRouterSwapProvidersFacet);
    await expect(
      routerSwapProvidersFacet.connect(someUser).addWhitelistedSwapProvider(swapProvider.address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addWhitelistedSwapProvider should successfully add new swap provider', async () => {
    const { owner, routerSwapProvidersFacet, swapProvider } = await loadFixture(deployRouterSwapProvidersFacet);

    await routerSwapProvidersFacet.connect(owner).addWhitelistedSwapProvider(swapProvider.address);

    expect(await routerSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(true);
  });

  it('removeWhitelistedSwapProvider should fail due to non owner caller', async () => {
    const { someUser, routerSwapProvidersFacet, swapProvider } = await loadFixture(deployRouterSwapProvidersFacet);

    await expect(
      routerSwapProvidersFacet.connect(someUser).removeWhitelistedSwapProvider(swapProvider.address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('removeWhitelistedSwapProvider should successfully remove swap provider', async () => {
    const { owner, routerSwapProvidersFacet, swapProvider } = await loadFixture(deployRouterSwapProvidersFacet);

    await routerSwapProvidersFacet.connect(owner).addWhitelistedSwapProvider(swapProvider.address);

    expect(await routerSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(true);

    await routerSwapProvidersFacet.connect(owner).removeWhitelistedSwapProvider(swapProvider.address);

    expect(await routerSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(false);
  });

  it('whitelistedSwapProvider should return false as swap provider is not registered yet', async () => {
    const { routerSwapProvidersFacet, swapProvider } = await loadFixture(deployRouterSwapProvidersFacet);

    expect(await routerSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(false);
  });
});

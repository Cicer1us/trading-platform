import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { WalletSwapProvidersFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';

describe('WalletSwapProvidersFacet', async () => {
  async function deployWalletSwapProvidersFacet() {
    const [owner, someUser, swapProvider] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'WalletSwapProvidersFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const walletSwapProvidersFacet = WalletSwapProvidersFacet__factory.connect(crossChainRouter.address, owner);

    return {
      owner,
      someUser,
      swapProvider,
      walletSwapProvidersFacet,
    };
  }

  it('addWhitelistedSwapProvider should fail due to non owner caller', async () => {
    const { someUser, walletSwapProvidersFacet, swapProvider } = await loadFixture(deployWalletSwapProvidersFacet);
    await expect(
      walletSwapProvidersFacet.connect(someUser).addWhitelistedSwapProvider(swapProvider.address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addWhitelistedSwapProvider should successfully add new swap provider', async () => {
    const { owner, walletSwapProvidersFacet, swapProvider } = await loadFixture(deployWalletSwapProvidersFacet);

    await walletSwapProvidersFacet.connect(owner).addWhitelistedSwapProvider(swapProvider.address);

    expect(await walletSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(true);
  });

  it('removeWhitelistedSwapProvider should fail due to non owner caller', async () => {
    const { someUser, walletSwapProvidersFacet, swapProvider } = await loadFixture(deployWalletSwapProvidersFacet);

    await expect(
      walletSwapProvidersFacet.connect(someUser).removeWhitelistedSwapProvider(swapProvider.address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('removeWhitelistedSwapProvider should successfully remove swap provider', async () => {
    const { owner, walletSwapProvidersFacet, swapProvider } = await loadFixture(deployWalletSwapProvidersFacet);

    await walletSwapProvidersFacet.connect(owner).addWhitelistedSwapProvider(swapProvider.address);

    expect(await walletSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(true);

    await walletSwapProvidersFacet.connect(owner).removeWhitelistedSwapProvider(swapProvider.address);

    expect(await walletSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(false);
  });

  it('whitelistedSwapProvider should return false as swap provider is not registered yet', async () => {
    const { walletSwapProvidersFacet, swapProvider } = await loadFixture(deployWalletSwapProvidersFacet);

    expect(await walletSwapProvidersFacet.whitelistedSwapProvider(swapProvider.address)).to.be.equal(false);
  });
});

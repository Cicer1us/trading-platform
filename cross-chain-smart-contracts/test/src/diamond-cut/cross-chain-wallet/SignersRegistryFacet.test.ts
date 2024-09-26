import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { SignersRegistryFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';
import { ZERO_ADDRESS } from '../../../utils/constants';

describe('SignersRegistryFacet', async () => {
  async function deployOracleProviderFacet() {
    const [owner, someUser, signersRegistry] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'SignersRegistryFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const signersRegistryFacet = SignersRegistryFacet__factory.connect(crossChainRouter.address, owner);

    return {
      owner,
      someUser,
      signersRegistry,
      signersRegistryFacet,
    };
  }

  it('setSignersRegistry should fail due to non owner caller', async () => {
    const { someUser, signersRegistryFacet, signersRegistry } = await loadFixture(deployOracleProviderFacet);
    await expect(signersRegistryFacet.connect(someUser).setSignersRegistry(signersRegistry.address)).to.be.revertedWith(
      'LibDiamond: Must be contract owner'
    );
  });

  it('setSignersRegistry should successfully set oracle provider address', async () => {
    const { owner, signersRegistryFacet, signersRegistry } = await loadFixture(deployOracleProviderFacet);

    await signersRegistryFacet.connect(owner).setSignersRegistry(signersRegistry.address);

    expect(await signersRegistryFacet.signersRegistry()).to.be.equal(signersRegistry.address);
  });

  it('oracleProvider return zero address as oracle provider is not registered yet', async () => {
    const { signersRegistryFacet } = await loadFixture(deployOracleProviderFacet);

    expect(await signersRegistryFacet.signersRegistry()).to.be.equal(ZERO_ADDRESS);
  });
});

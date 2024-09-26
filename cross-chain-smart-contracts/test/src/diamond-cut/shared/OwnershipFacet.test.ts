import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { OwnershipFacet__factory } from '../../../../typechain/factories/src/diamond-cut/shared/facets';
import { expect } from '../../../utils/chai-setup';

describe('OwnershipFacet', async () => {
  async function deployDiamondCut() {
    const [owner, anyUser] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['OwnershipFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    // Use CrossChainRouter or CrossChainWallet as a base contract
    const DiamondCut = await ethers.getContractFactory('CrossChainRouter');
    const diamondCut = await DiamondCut.deploy(cuts, owner.address);
    await diamondCut.deployed();
    const ownershipFacet = OwnershipFacet__factory.connect(diamondCut.address, owner);

    return {
      owner,
      anyUser,
      ownershipFacet,
    };
  }

  it('Default owner address is address passed in the constructor', async () => {
    const { owner, ownershipFacet } = await loadFixture(deployDiamondCut);
    expect(await ownershipFacet.owner()).to.be.equal(owner.address);
  });

  it('Only owner can update address: rejected because caller is not owner', async () => {
    const { ownershipFacet, anyUser } = await loadFixture(deployDiamondCut);
    await expect(ownershipFacet.connect(anyUser).transferOwnership(anyUser.address)).to.be.revertedWith(
      'LibDiamond: Must be contract owner'
    );
  });

  it('Only owner can update address: success', async () => {
    const { owner, ownershipFacet, anyUser } = await loadFixture(deployDiamondCut);
    expect(await ownershipFacet.owner()).to.be.equal(owner.address);
    await expect(ownershipFacet.connect(owner).transferOwnership(anyUser.address))
      .to.emit(ownershipFacet, 'OwnershipTransferred')
      .withArgs(owner.address, anyUser.address);
    expect(await ownershipFacet.owner()).to.be.equal(anyUser.address);
  });
});

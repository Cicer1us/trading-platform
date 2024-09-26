import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { CrossChainRoutersFacet, CrossChainRoutersFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';
import { ZERO_ADDRESS } from '../../../utils/constants';

describe('CrossChainRoutersFacet', async () => {
  async function deployCrossChainRoutersFacet() {
    const [owner, someUser, crossChainRouter1, crossChainRouter2] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet', 'CrossChainRoutersFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const crossChainRoutersFacet = CrossChainRoutersFacet__factory.connect(crossChainRouter.address, owner);

    const crossChainRoutersFacetInput: CrossChainRoutersFacet.CrossChainRouterArgsStruct[] = [
      {
        router: crossChainRouter1.address,
        chainId: 1,
      },
      {
        router: crossChainRouter2.address,
        chainId: 56,
      },
    ];

    return {
      owner,
      someUser,
      crossChainRoutersFacetInput,
      crossChainRouter1,
      crossChainRouter2,
      crossChainRoutersFacet,
    };
  }

  it('addCrossChainRouters should fail due to non owner caller', async () => {
    const { someUser, crossChainRoutersFacet, crossChainRoutersFacetInput } = await loadFixture(
      deployCrossChainRoutersFacet
    );
    await expect(
      crossChainRoutersFacet.connect(someUser).addCrossChainRouters(crossChainRoutersFacetInput)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addCrossChainRouters should successfully add new cross chain router', async () => {
    const { owner, crossChainRoutersFacet, crossChainRoutersFacetInput, crossChainRouter1, crossChainRouter2 } =
      await loadFixture(deployCrossChainRoutersFacet);

    await crossChainRoutersFacet.connect(owner).addCrossChainRouters(crossChainRoutersFacetInput);

    expect(await crossChainRoutersFacet.crossChainRouter(1)).to.be.equal(crossChainRouter1.address);
    expect(await crossChainRoutersFacet.crossChainRouter(56)).to.be.equal(crossChainRouter2.address);
  });

  it('removeCrossChainRouter should fail due to non owner caller', async () => {
    const { someUser, crossChainRoutersFacet } = await loadFixture(deployCrossChainRoutersFacet);

    await expect(crossChainRoutersFacet.connect(someUser).removeCrossChainRouter(1)).to.be.revertedWith(
      'LibDiamond: Must be contract owner'
    );
  });

  it('removeCrossChainRouter should successfully remove cross chain router', async () => {
    const { owner, crossChainRoutersFacet, crossChainRoutersFacetInput, crossChainRouter1 } = await loadFixture(
      deployCrossChainRoutersFacet
    );

    await crossChainRoutersFacet.connect(owner).addCrossChainRouters(crossChainRoutersFacetInput);

    expect(await crossChainRoutersFacet.crossChainRouter(1)).to.be.equal(crossChainRouter1.address);

    await crossChainRoutersFacet.connect(owner).removeCrossChainRouter(1);

    expect(await crossChainRoutersFacet.crossChainRouter(1)).to.be.equal(ZERO_ADDRESS);
  });

  it('crossChainRouter return zero address as cross chain router not registered yet', async () => {
    const { crossChainRoutersFacet } = await loadFixture(deployCrossChainRoutersFacet);

    expect(await crossChainRoutersFacet.crossChainRouter(1)).to.be.equal(ZERO_ADDRESS);
  });
});

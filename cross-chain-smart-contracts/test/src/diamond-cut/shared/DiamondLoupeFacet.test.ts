import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { DiamondLoupeFacet__factory } from '../../../../typechain';
import { parseLogArgs } from '../../../utils';

describe('DiamondLoupeFacet', async () => {
  async function deployDiamondCut() {
    const [owner, anyUser] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = ['DiamondLoupeFacet', 'DiamondCutFacet'];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    // Use CrossChainRouter or CrossChainWallet as a base contract
    const DiamondCut = await ethers.getContractFactory('CrossChainRouter');
    const diamondCut = await DiamondCut.deploy(cuts, owner.address);
    const diamondLoupeFacet = DiamondLoupeFacet__factory.connect(diamondCut.address, owner);

    await diamondCut.deployed();

    return {
      facetCuts: cuts,
      owner,
      anyUser,
      diamondLoupeFacet,
    };
  }

  it('Return correct added facet and their function selectors', async () => {
    const { facetCuts, diamondLoupeFacet } = await loadFixture(deployDiamondCut);

    const initFacets = facetCuts.map((facetCut) => ({
      facetAddress: facetCut.facetAddress,
      functionSelectors: facetCut.functionSelectors,
    }));
    const initFacetAddress = facetCuts.map((facetCut) => facetCut.facetAddress);

    const facets = (await diamondLoupeFacet.facets()).map(parseLogArgs);
    const facetAddresses = await diamondLoupeFacet.facetAddresses();

    expect(initFacets).to.be.deep.equal(facets);
    expect(initFacetAddress).to.be.deep.equal(facetAddresses);
  });

  it('Return function selectors by facet address', async () => {
    const { facetCuts, diamondLoupeFacet } = await loadFixture(deployDiamondCut);

    const facet = facetCuts[0];
    const facetsFunctionSelectors = await diamondLoupeFacet.facetFunctionSelectors(facet.facetAddress);

    expect(facetsFunctionSelectors).to.be.deep.equal(facet.functionSelectors);
  });

  it('Return facet addresses by function selectors', async () => {
    const { facetCuts, diamondLoupeFacet } = await loadFixture(deployDiamondCut);

    const firstFacet = facetCuts[0];
    const firstFacetAddresses = await diamondLoupeFacet.facetAddress(firstFacet.functionSelectors[0]);

    const secondFacet = facetCuts[1];
    const secondFacetAddresses = await diamondLoupeFacet.facetAddress(secondFacet.functionSelectors[0]);

    expect(firstFacetAddresses).to.be.equal(firstFacet.facetAddress);
    expect(secondFacetAddresses).to.be.equal(secondFacet.facetAddress);
  });

  it('Return supported interfaces', async () => {
    const { diamondLoupeFacet } = await loadFixture(deployDiamondCut);

    // TODO: add checks for other interfaces
    expect(await diamondLoupeFacet.supportsInterface('0x01ffc9a7')).to.be.equal(true);
  });
});

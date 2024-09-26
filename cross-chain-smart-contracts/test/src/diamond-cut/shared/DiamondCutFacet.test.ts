import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut, FacetCutAction } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { ConnectorTokenHolderFacet__factory, DiamondLoupeFacet__factory, IDiamondLoupe } from '../../../../typechain';
import { DiamondCutFacet__factory } from '../../../../typechain/factories/src/diamond-cut/shared/facets';
import { expectRevertWithReason, parseLogArgs } from '../../../utils';
import { expect } from '../../../utils/chai-setup';
import { ZERO_ADDRESS } from '../../../utils/constants';

describe('DiamondCutFacet', async () => {
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
    await diamondCut.deployed();
    // for default facets set address to the diamondCut address
    const diamondCutFacet = DiamondCutFacet__factory.connect(diamondCut.address, owner);
    const diamondLoupeFacet = DiamondLoupeFacet__factory.connect(diamondCut.address, owner);

    const preDeployedFacetCuts: FacetCut[] = [];
    await deployFacet('ConnectorTokensFacet', preDeployedFacetCuts);
    await diamondCutFacet.diamondCut(preDeployedFacetCuts, ZERO_ADDRESS, '0x');

    const addFacetCuts: FacetCut[] = [];
    // it could be any facet
    await deployFacet('OwnershipFacet', addFacetCuts);

    return {
      owner,
      anyUser,
      diamondCutFacet,
      diamondLoupeFacet,
      addFacetCuts,
      preDeployedFacetCut: preDeployedFacetCuts[0],
    };
  }

  it('Only owner can update address: rejected because caller is not owner', async () => {
    const { diamondCutFacet, anyUser } = await loadFixture(deployDiamondCut);

    const addFacetCuts: FacetCut[] = [];
    await deployFacet('OwnershipFacet', addFacetCuts);

    await expect(diamondCutFacet.connect(anyUser).diamondCut(addFacetCuts, ZERO_ADDRESS, '0x')).to.be.revertedWith(
      'LibDiamond: Must be contract owner'
    );
  });

  it('diamondCut method emits DiamondCut event', async () => {
    const { diamondCutFacet, owner, addFacetCuts } = await loadFixture(deployDiamondCut);

    const res = await diamondCutFacet.connect(owner).diamondCut(addFacetCuts, ZERO_ADDRESS, '0x');
    const receipt = await res.wait();

    const diamondCutEvent = receipt.events?.find((event) => event?.event === 'DiamondCut');

    if (diamondCutEvent) {
      const decodedEvent = diamondCutFacet.interface.parseLog(diamondCutEvent);
      const parsedEventArgs = parseLogArgs(decodedEvent.args);

      expect(parsedEventArgs._diamondCut).to.deep.equal(addFacetCuts);
      expect(parsedEventArgs._init).to.be.equal(ZERO_ADDRESS);
      expect(parsedEventArgs._calldata).to.be.equal('0x');
    }
  });

  it('Add new facet: success', async () => {
    const { diamondCutFacet, owner, diamondLoupeFacet, addFacetCuts } = await loadFixture(deployDiamondCut);

    const addFacetCut = addFacetCuts[0];

    const facetsBefore: IDiamondLoupe.FacetStructOutput[] = await diamondLoupeFacet.facets();
    expect(facetsBefore.some((facet) => facet.facetAddress === addFacetCut.facetAddress)).to.be.false;

    await diamondCutFacet.connect(owner).diamondCut(addFacetCuts, ZERO_ADDRESS, '0x');

    const facetsAfter: IDiamondLoupe.FacetStructOutput[] = await diamondLoupeFacet.facets();
    expect(facetsAfter.some((facet) => facet.facetAddress === addFacetCut.facetAddress)).to.be.true;
    expect(
      facetsAfter.find((facet) => facet.facetAddress === addFacetCut.facetAddress)?.functionSelectors
    ).to.deep.equal(addFacetCut.functionSelectors);
  });

  it('Add new facet: reverted because of functionsSelectors array is empty', async () => {
    const { diamondCutFacet, owner, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const replaceFacetCut: FacetCut = {
      ...preDeployedFacetCut,
      functionSelectors: [],
      action: FacetCutAction.Add,
    };

    await expect(diamondCutFacet.connect(owner).diamondCut([replaceFacetCut], ZERO_ADDRESS, '0x')).to.be.revertedWith(
      'LibDiamondCut: No selectors in facet to cut'
    );
  });

  it('Add new facet: reverted because of facet address is ZERO_ADDRESS', async () => {
    const { diamondCutFacet, owner, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const replaceFacetCut: FacetCut = {
      ...preDeployedFacetCut,
      facetAddress: ZERO_ADDRESS,
      action: FacetCutAction.Add,
    };

    await expectRevertWithReason(
      diamondCutFacet.connect(owner).diamondCut([replaceFacetCut], ZERO_ADDRESS, '0x'),
      "LibDiamondCut: Add facet can't be address(0)"
    );
  });

  it('Replace facet: success', async () => {
    const { diamondCutFacet, owner, diamondLoupeFacet, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const facetsBefore: IDiamondLoupe.FacetStructOutput[] = await diamondLoupeFacet.facets();
    expect(facetsBefore.some((facet) => facet.facetAddress === preDeployedFacetCut.facetAddress)).to.be.true;

    const sameToDeployedFacetCuts: FacetCut[] = [];
    // it should have same facet selectors but different implementation (therefore different facet address)
    await deployFacet('ConnectorTokensFacet', sameToDeployedFacetCuts);

    const replaceFacetCut = {
      ...sameToDeployedFacetCuts[0],
      action: FacetCutAction.Replace,
    };

    await diamondCutFacet.connect(owner).diamondCut([replaceFacetCut], ZERO_ADDRESS, '0x');

    const facetsAfter: IDiamondLoupe.FacetStructOutput[] = await diamondLoupeFacet.facets();

    expect(facetsAfter.length).to.be.equal(facetsBefore.length);
    expect(facetsAfter.some((facet) => facet.facetAddress === preDeployedFacetCut.facetAddress)).to.be.false;
    expect(facetsAfter.some((facet) => facet.facetAddress === replaceFacetCut.facetAddress)).to.be.true;
    expect(
      facetsAfter.some((facet) =>
        facet.functionSelectors.every((sel) => replaceFacetCut.functionSelectors.includes(sel))
      )
    ).to.be.true;
  });

  it('Replace facet: reverted because of functionsSelectors array is empty', async () => {
    const { diamondCutFacet, owner, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const replaceFacetCut: FacetCut = {
      ...preDeployedFacetCut,
      functionSelectors: [],
      action: FacetCutAction.Replace,
    };

    await expect(diamondCutFacet.connect(owner).diamondCut([replaceFacetCut], ZERO_ADDRESS, '0x')).to.be.revertedWith(
      'LibDiamondCut: No selectors in facet to cut'
    );
  });

  it('Replace facet: reverted because of same facet address', async () => {
    const { diamondCutFacet, owner, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const replaceFacetCut: FacetCut = {
      ...preDeployedFacetCut,
      action: FacetCutAction.Replace,
    };

    await expect(diamondCutFacet.connect(owner).diamondCut([replaceFacetCut], ZERO_ADDRESS, '0x')).to.be.revertedWith(
      "LibDiamondCut: Can't replace function with same function"
    );
  });

  it('Replace facet: reverted because of facet address is ZERO_ADDRESS', async () => {
    const { diamondCutFacet, preDeployedFacetCut, owner } = await loadFixture(deployDiamondCut);

    const removeFacetCut = {
      ...preDeployedFacetCut,
      facetAddress: ZERO_ADDRESS,
      action: FacetCutAction.Replace,
    };

    await expectRevertWithReason(
      diamondCutFacet.connect(owner).diamondCut([removeFacetCut], ZERO_ADDRESS, '0x'),
      "LibDiamondCut: Add facet can't be address(0)"
    );
  });

  it('Remove facet: success', async () => {
    const { diamondCutFacet, owner, diamondLoupeFacet, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const facetsBefore: IDiamondLoupe.FacetStructOutput[] = await diamondLoupeFacet.facets();
    expect(facetsBefore.some((facet) => facet.facetAddress === preDeployedFacetCut.facetAddress)).to.be.true;

    const removeFacetCut = {
      ...preDeployedFacetCut,
      facetAddress: ZERO_ADDRESS,
      action: FacetCutAction.Remove,
    };

    await diamondCutFacet.connect(owner).diamondCut([removeFacetCut], ZERO_ADDRESS, '0x');

    const facetsAfter: IDiamondLoupe.FacetStructOutput[] = await diamondLoupeFacet.facets();

    // check if only one facet was removed
    expect(facetsBefore.length - facetsAfter.length).to.be.equal(1);
    expect(facetsAfter.some((facet) => facet.facetAddress === preDeployedFacetCut.facetAddress)).to.be.false;
    expect(
      facetsAfter.some((facet) =>
        facet.functionSelectors.every((sel) => removeFacetCut.functionSelectors.includes(sel))
      )
    ).to.be.false;
  });

  it('Remove facet: reverted because of facet address is not ZERO_ADDRESS', async () => {
    const { diamondCutFacet, preDeployedFacetCut, owner } = await loadFixture(deployDiamondCut);

    const removeFacetCut = {
      ...preDeployedFacetCut,
      action: FacetCutAction.Remove,
    };

    await expectRevertWithReason(
      diamondCutFacet.connect(owner).diamondCut([removeFacetCut], ZERO_ADDRESS, '0x'),
      'LibDiamondCut: Remove facet address must be address(0)'
    );
  });

  it('Remove facet: reverted because of functionsSelectors array is empty', async () => {
    const { diamondCutFacet, owner, preDeployedFacetCut } = await loadFixture(deployDiamondCut);

    const removeFacetCut = {
      facetAddress: preDeployedFacetCut.facetAddress,
      functionSelectors: [],
      action: FacetCutAction.Remove,
    };

    await expect(diamondCutFacet.connect(owner).diamondCut([removeFacetCut], ZERO_ADDRESS, '0x')).to.be.revertedWith(
      'LibDiamondCut: No selectors in facet to cut'
    );
  });

  it('Execute diamond cut with init function', async () => {
    const { diamondCutFacet, owner } = await loadFixture(deployDiamondCut);

    const chainId = '1';
    const connectorTokenHolderFacet = ConnectorTokenHolderFacet__factory.connect(diamondCutFacet.address, owner);
    const addConnectorTokenHoldersCalldata = connectorTokenHolderFacet.interface.encodeFunctionData(
      'addConnectorTokenHolders',
      [[{ holder: owner.address, chainId }]]
    );

    const connectorTokenHolderFacetCuts: FacetCut[] = [];
    await deployFacet('ConnectorTokenHolderFacet', connectorTokenHolderFacetCuts);

    await diamondCutFacet
      .connect(owner)
      .diamondCut(
        connectorTokenHolderFacetCuts,
        connectorTokenHolderFacetCuts[0].facetAddress,
        addConnectorTokenHoldersCalldata
      );

    expect(await connectorTokenHolderFacet.connectorTokenHolder(chainId)).to.be.equal(owner.address);
  });
});

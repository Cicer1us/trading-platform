import { connectorTokens, usdcToken } from '@bitoftrade/cross-chain-core';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import { ConnectorTokensDecimalsFacet, ConnectorTokensDecimalsFacet__factory } from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';

describe('ConnectorTokensDecimalsFacet', async () => {
  async function deployConnectorTokensDecimalsFacet() {
    const [owner, someUser] = await ethers.getSigners();

    const cuts: FacetCut[] = [];

    const requiredFacetNames = [
      'DiamondCutFacet',
      'DiamondLoupeFacet',
      'OwnershipFacet',
      'ConnectorTokensDecimalsFacet',
    ];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();
    const connectorTokensDecimalsFacet = ConnectorTokensDecimalsFacet__factory.connect(crossChainRouter.address, owner);

    const connectorTokensDecimalsFacetInput: ConnectorTokensDecimalsFacet.ConnectorTokenArgsStruct[] = [
      {
        token: connectorTokens[1][usdcToken[1].address].address,
        decimals: connectorTokens[1][usdcToken[1].address].decimals,
        chainId: 1,
      },
      {
        token: connectorTokens[56][usdcToken[56].address].address,
        decimals: connectorTokens[56][usdcToken[56].address].decimals,
        chainId: 56,
      },
    ];

    return {
      owner,
      someUser,
      connectorTokensDecimalsFacetInput,
      connectorTokensDecimalsFacet,
    };
  }

  it('addWhitelistedConnectorTokenDecimals should fail due to non owner caller', async () => {
    const { someUser, connectorTokensDecimalsFacet, connectorTokensDecimalsFacetInput } = await loadFixture(
      deployConnectorTokensDecimalsFacet
    );
    await expect(
      connectorTokensDecimalsFacet
        .connect(someUser)
        .addWhitelistedConnectorTokenDecimals(connectorTokensDecimalsFacetInput)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('addWhitelistedConnectorTokenDecimals should successfully add new connector token decimals', async () => {
    const { owner, connectorTokensDecimalsFacet, connectorTokensDecimalsFacetInput } = await loadFixture(
      deployConnectorTokensDecimalsFacet
    );

    await connectorTokensDecimalsFacet
      .connect(owner)
      .addWhitelistedConnectorTokenDecimals(connectorTokensDecimalsFacetInput);

    expect(
      await connectorTokensDecimalsFacet.whitelistedConnectorTokenDecimals(
        1,
        connectorTokens[1][usdcToken[1].address].address
      )
    ).to.be.equal(6);
    expect(
      await connectorTokensDecimalsFacet.whitelistedConnectorTokenDecimals(
        56,
        connectorTokens[56][usdcToken[56].address].address
      )
    ).to.be.equal(18);
  });

  it('removeWhitelistedConnectorTokenDecimals should fail due to non owner caller', async () => {
    const { someUser, connectorTokensDecimalsFacet } = await loadFixture(deployConnectorTokensDecimalsFacet);

    await expect(
      connectorTokensDecimalsFacet
        .connect(someUser)
        .removeWhitelistedConnectorTokenDecimals(1, connectorTokens[1][usdcToken[1].address].address)
    ).to.be.revertedWith('LibDiamond: Must be contract owner');
  });

  it('removeWhitelistedConnectorTokenDecimals should successfully remove connector token decimals', async () => {
    const { owner, connectorTokensDecimalsFacet, connectorTokensDecimalsFacetInput } = await loadFixture(
      deployConnectorTokensDecimalsFacet
    );

    await connectorTokensDecimalsFacet
      .connect(owner)
      .addWhitelistedConnectorTokenDecimals(connectorTokensDecimalsFacetInput);

    expect(
      await connectorTokensDecimalsFacet.whitelistedConnectorTokenDecimals(
        1,
        connectorTokens[1][usdcToken[1].address].address
      )
    ).to.be.equal(6);

    await connectorTokensDecimalsFacet
      .connect(owner)
      .removeWhitelistedConnectorTokenDecimals(1, connectorTokens[1][usdcToken[1].address].address);

    expect(
      await connectorTokensDecimalsFacet.whitelistedConnectorTokenDecimals(
        1,
        connectorTokens[1][usdcToken[1].address].address
      )
    ).to.be.equal(0);
  });

  it('whitelistedConnectorTokenDecimals return 0 as connector token decimals not registered yet', async () => {
    const { connectorTokensDecimalsFacet } = await loadFixture(deployConnectorTokensDecimalsFacet);

    expect(
      await connectorTokensDecimalsFacet.whitelistedConnectorTokenDecimals(
        1,
        connectorTokens[1][usdcToken[1].address].address
      )
    ).to.be.equal(0);
  });
});

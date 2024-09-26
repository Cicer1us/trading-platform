import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet, deployFacetWithInitData, transferDiamondOwnership } from '../utils';
import routerFacetsDeployArgs from './params';

const owner = process.env.GNOSIS_SAFE_ADMIN;

async function deploy() {
  const network = await ethers.provider.getNetwork();
  const deploymentArgs = routerFacetsDeployArgs[network.chainId];
  if (!deploymentArgs) {
    throw new Error('Deployment args are not provided');
  }

  const cuts: FacetCut[] = [];

  console.log('Deploying required facets:');
  const requiredFacetNames = ['DiamondCutFacet', 'DiamondLoupeFacet', 'OwnershipFacet'];
  for (const facetName of requiredFacetNames) {
    await deployFacet(facetName, cuts);
  }

  console.log('');
  console.log('Deploying CrossChainRouter facets (without initial data):');
  const crossChainRouterFacetNames = ['SrcCrossSwapFacet', 'MultichainTokenBridgeFacet'];
  for (const facetName of crossChainRouterFacetNames) {
    await deployFacet(facetName, cuts);
  }

  console.log('');
  console.log('Deploying CrossChainRouter Diamond...');
  const Diamond = await ethers.getContractFactory('CrossChainRouter');
  const diamond = await Diamond.deploy(cuts, owner, { gasLimit: '0x2dc6c0' });
  await diamond.deployed();

  console.log('CrossChainRouter deployed:', diamond.address);

  console.log('');
  console.log('Deploying CrossChainRouter Facets with initial data...');

  for (const facet of routerFacetsDeployArgs[network.chainId]) {
    await deployFacetWithInitData(diamond.address, facet.facetName, facet.initMethod, facet.initArgs);
  }
  await transferDiamondOwnership(diamond.address, '0x08E194787b65f86AA3C2990F7F009E9603Bbff25');
}

deploy();

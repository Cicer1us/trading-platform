import { Contract } from 'ethers';
import { FacetCutAction } from 'hardhat-deploy/dist/types';
import { ethers } from 'hardhat';
import { IDiamondCut, OwnershipFacet } from '../../../typechain';

export interface FacetInitArgs {
  facetName: string;
  initMethod: string;
  initArgs: any[];
}

export type ChainId = number;
export type FacetDeployArgs = Record<ChainId, FacetInitArgs[]>;

export interface FacetCut {
  facetAddress: string;
  action: FacetCutAction;
  functionSelectors: string[];
}

export function getSelectors(contract: Contract): string[] {
  const signatures = Object.keys(contract.interface.functions);

  return signatures.reduce((acc: string[], val: string) => {
    if (val !== 'init(bytes)') {
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []);
}

export async function deployFacet(facetName: string, cuts: FacetCut[]): Promise<string> {
  ethers.logger.info(`Deploying ${facetName}...`);

  const Facet = await ethers.getContractFactory(facetName);
  const facet = await Facet.deploy({ gasPrice: await getGasPrice() });

  await facet.deployed();

  ethers.logger.info(`${facetName} deployed: ${facet.address}`);

  cuts.push({
    facetAddress: facet.address,
    action: FacetCutAction.Add,
    functionSelectors: getSelectors(facet),
  });

  return facet.address;
}

export async function deployFacetWithInitData(
  diamondAddress: string,
  facetName: string,
  initMethod: string,
  initValues: any[]
) {
  const diamondCut: IDiamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress);
  const Facet = await ethers.getContractFactory(facetName);
  const cuts: FacetCut[] = [];
  const facetAddress = await deployFacet(facetName, cuts);
  const initFunctionCall = Facet.interface.encodeFunctionData(initMethod, initValues);

  ethers.logger.info(`Adding ${facetName} to Diamond...`);
  const tx = await diamondCut.diamondCut(cuts, facetAddress, initFunctionCall, {
    gasPrice: await getGasPrice(),
    gasLimit: '0x2dc6c0',
  });

  return tx.wait();
}

export async function transferDiamondOwnership(diamondAddress: string, newOwner: string) {
  const ownershipFacet: OwnershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress);

  const tx = await ownershipFacet.transferOwnership(newOwner);
  return tx.wait();
}

export async function getGasPrice() {
  // increased default gas price by 50 %
  const gasPrice = await ethers.provider.getGasPrice();
  return gasPrice?.add(gasPrice.div(2));
}

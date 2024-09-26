import { ethers } from 'hardhat';
import { FacetCutAction } from 'hardhat-deploy/dist/types';
import { IDiamondCut } from '../../../../../typechain';
import { getGasPrice, getSelectors } from '../../utils';

const diamondAddress = '0xd9739B7acA106593a278AEfC2cC1392A43d5EF03';

const main = async () => {
  const Facet = await ethers.getContractFactory('SrcCrossSwapFacet');
  const facet = await Facet.deploy({ gasPrice: await getGasPrice() });

  await facet.deployed();

  console.log(`SrcCrossSwapFacet deployed: ${facet.address}`);

  const cuts = [
    {
      facetAddress: facet.address,
      action: FacetCutAction.Replace,
      functionSelectors: getSelectors(facet),
    },
  ];

  const diamondCut: IDiamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress);
  const tx = await diamondCut.diamondCut(cuts, '0x0000000000000000000000000000000000000000', '0x', {
    gasPrice: await getGasPrice(),
    gasLimit: '0x2dc6c0',
  });

  return tx.wait();
};

main();

import { ethers, upgrades } from 'hardhat';

async function main() {
  const SignersRegistry = await ethers.getContractFactory('SignersRegistry');
  const owner = process.env.GNOSIS_SAFE_ADMIN;

  const signerRegistry = await upgrades.deployProxy(SignersRegistry, [owner], {
    initializer: 'initialize',
    kind: 'uups',
  });

  await signerRegistry.deployed();
  const implementation = await upgrades.erc1967.getImplementationAddress(signerRegistry.address);

  console.log(signerRegistry.address, ': Proxy (SignersRegistry)');
  console.log(implementation, ': Implementation (SignersRegistry)');
}

main();

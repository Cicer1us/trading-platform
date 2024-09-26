import { ethers, upgrades } from 'hardhat';

async function main() {
  const KeyShareManager = await ethers.getContractFactory('KeyShareManager');
  const owner = process.env.GNOSIS_SAFE_ADMIN;

  const keyShareManager = await upgrades.deployProxy(KeyShareManager, [owner], {
    initializer: 'initialize',
    kind: 'uups',
  });

  await keyShareManager.deployed();
  const implementation = await upgrades.erc1967.getImplementationAddress(keyShareManager.address);

  console.log(keyShareManager.address, ': Proxy (KeyShareManager)');
  console.log(implementation, ': Implementation (KeyShareManager)');
}

main();

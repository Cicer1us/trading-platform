import { expect } from '../../utils/chai-setup';
import { ethers, upgrades } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ZERO_ADDRESS } from '../../utils/constants';
import { KeyShareManager } from '../../../typechain';

describe('KeyShareManager', async () => {
  async function deployKeyShareManager() {
    const [owner, keyShareAdmin, keyShareHolder, someUser, signer] = await ethers.getSigners();

    const keyShareAdmins = [keyShareAdmin.address];

    // Deploy KeyShareManager Contract
    const KeyShareManager = await ethers.getContractFactory('KeyShareManager');
    const keyShareManager = <KeyShareManager>await upgrades.deployProxy(KeyShareManager, [owner.address], {
      initializer: 'initialize',
      kind: 'uups',
    });

    return {
      signer,
      owner,
      keyShareAdmin,
      someUser,
      keyShareHolder,
      keyShareManager,
      keyShareAdmins,
    };
  }

  it('setKeyShareAdmins should fail due to non owner caller', async () => {
    const { keyShareManager, someUser, keyShareAdmins } = await loadFixture(deployKeyShareManager);

    await expect(keyShareManager.connect(someUser).setKeyShareAdmins(keyShareAdmins)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('setKeyShareAdmins should successfully set array of validators owners', async () => {
    const { keyShareManager, owner, keyShareAdmins } = await loadFixture(deployKeyShareManager);

    expect(await keyShareManager.keyShareAdmins()).to.be.eql([]);

    await keyShareManager.connect(owner).setKeyShareAdmins(keyShareAdmins);

    expect(await keyShareManager.keyShareAdmins()).to.be.eql(keyShareAdmins);
  });

  it('setKeyShareHolder reverted because of the initiator is not a KeyShareAdmin', async () => {
    const { keyShareManager, owner, someUser, keyShareHolder, keyShareAdmins } = await loadFixture(
      deployKeyShareManager
    );

    await keyShareManager.connect(owner).setKeyShareAdmins(keyShareAdmins);
    await expect(keyShareManager.connect(someUser).setKeyShareHolder(keyShareHolder.address)).to.be.revertedWith(
      'Initiator is not KeyShareAdmin'
    );
  });

  it('setKeyShareHolder should successfully add new keyShareHolder', async () => {
    const { keyShareManager, owner, keyShareHolder, keyShareAdmin, keyShareAdmins } = await loadFixture(
      deployKeyShareManager
    );

    await keyShareManager.connect(owner).setKeyShareAdmins(keyShareAdmins);
    expect(await keyShareManager.keyShareHolderByAdmin(keyShareAdmin.address)).to.equal(ZERO_ADDRESS);

    await keyShareManager.connect(keyShareAdmin).setKeyShareHolder(keyShareHolder.address);

    expect(await keyShareManager.keyShareHolderByAdmin(keyShareAdmin.address)).to.equal(keyShareHolder.address);
  });

  it('getKeyShareHolder should return zero address as keyShareAdmin not registered yet', async () => {
    const { keyShareManager, someUser } = await loadFixture(deployKeyShareManager);
    expect(await keyShareManager.keyShareHolderByAdmin(someUser.address)).to.be.equal(ZERO_ADDRESS);
  });

  it('isKeyShareAdmin should return true for keyShareAdmin address', async () => {
    const { keyShareManager, keyShareAdmin, owner, keyShareAdmins } = await loadFixture(deployKeyShareManager);

    expect(await keyShareManager.isKeyShareAdmin(keyShareAdmin.address)).to.be.equal(false);
    await keyShareManager.connect(owner).setKeyShareAdmins(keyShareAdmins);
    expect(await keyShareManager.isKeyShareAdmin(keyShareAdmin.address)).to.be.equal(true);
  });

  it('isKeyShareAdmin should return false for random user address', async () => {
    const { keyShareManager, someUser } = await loadFixture(deployKeyShareManager);
    expect(await keyShareManager.isKeyShareAdmin(someUser.address)).to.be.equal(false);
  });

  it('getKeyShareHolder should return keyShareHolder address', async () => {
    const { keyShareManager, owner, keyShareHolder, keyShareAdmin, keyShareAdmins } = await loadFixture(
      deployKeyShareManager
    );

    await keyShareManager.connect(owner).setKeyShareAdmins(keyShareAdmins);
    await keyShareManager.connect(keyShareAdmin).setKeyShareHolder(keyShareHolder.address);
    expect(await keyShareManager.keyShareHolderByAdmin(keyShareAdmin.address)).to.be.equal(keyShareHolder.address);
  });

  it('set signer address: success', async () => {
    const { keyShareManager, owner, signer } = await loadFixture(deployKeyShareManager);

    expect(await keyShareManager.callStatic.signer()).to.be.equal(ZERO_ADDRESS);
    await keyShareManager.connect(owner).setSigner(signer.address);

    expect(await keyShareManager.callStatic.signer()).to.be.equal(signer.address);
  });

  it('set signer address: reverted because of not admin call', async () => {
    const { keyShareManager, someUser, signer } = await loadFixture(deployKeyShareManager);

    await expect(keyShareManager.connect(someUser).setSigner(signer.address)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });
});

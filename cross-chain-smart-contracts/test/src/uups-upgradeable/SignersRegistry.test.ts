import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers, upgrades } from 'hardhat';
import { expect } from '../../utils/chai-setup';
import { SignersRegistry } from '../../../typechain/src/uups-upgradeable/SignersRegistry';

describe('SignersRegistry', () => {
  async function deploySignersRegistry() {
    const [admin, anyUser, signer, signerAdmin] = await ethers.getSigners();
    const SignersRegistry = await ethers.getContractFactory('SignersRegistry');

    const signersRegistry = (await upgrades.deployProxy(SignersRegistry, [admin.address], {
      initializer: 'initialize',
      kind: 'uups',
    })) as SignersRegistry;

    return { admin, signersRegistry, anyUser, signer, signerAdmin };
  }

  describe('Public signers', () => {
    it('Add signer and check whitelisted: success', async () => {
      const { signersRegistry, signer, admin } = await loadFixture(deploySignersRegistry);

      expect(await signersRegistry.isPublicWhitelisted(signer.address)).to.be.equal(false);

      await expect(signersRegistry.connect(admin).addPublicSigner(signer.address))
        .to.emit(signersRegistry, 'PublicSignerAdded')
        .withArgs(signer.address);

      expect(await signersRegistry.isPublicWhitelisted(signer.address)).to.be.equal(true);
    });

    it('Add signer and check whitelisted: reverted because of not admin call', async () => {
      const { signersRegistry, signer, anyUser } = await loadFixture(deploySignersRegistry);

      await expect(signersRegistry.connect(anyUser).addPublicSigner(signer.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('Remove signer and check whitelisted: success', async () => {
      const { signersRegistry, signer, admin } = await loadFixture(deploySignersRegistry);

      // add signer
      expect(await signersRegistry.isPublicWhitelisted(signer.address)).to.be.equal(false);
      await signersRegistry.connect(admin).addPublicSigner(signer.address);
      expect(await signersRegistry.isPublicWhitelisted(signer.address)).to.be.equal(true);

      await expect(signersRegistry.connect(admin).removePublicSigner(signer.address))
        .to.emit(signersRegistry, 'PublicSignerRemoved')
        .withArgs(signer.address);

      expect(await signersRegistry.isPublicWhitelisted(signer.address)).to.be.equal(false);
    });

    it('Remove signer and check whitelisted: reverted because of not admin call', async () => {
      const { signersRegistry, signer, anyUser } = await loadFixture(deploySignersRegistry);

      await expect(signersRegistry.connect(anyUser).removePublicSigner(signer.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
  });

  describe('Private signers', () => {
    it('Add signer admin and check rights to add signers: success', async () => {
      const { signersRegistry, signerAdmin, admin } = await loadFixture(deploySignersRegistry);

      expect(await signersRegistry.privateSignerAdmin(signerAdmin.address)).to.be.equal(false);

      await signersRegistry.connect(admin).addPrivateSignerAdmin(signerAdmin.address);

      expect(await signersRegistry.privateSignerAdmin(signerAdmin.address)).to.be.equal(true);
    });

    it('Add private signers: failed because initiator is not signerAdmin', async () => {
      const { signersRegistry, signerAdmin, anyUser } = await loadFixture(deploySignersRegistry);

      expect(await signersRegistry.privateSignerAdmin(signerAdmin.address)).to.be.equal(false);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners([anyUser.address])).to.be.revertedWith(
        'Caller is not the signer admin'
      );
    });

    it('Add private signers for signerAdmin and check isPrivateWhitelisted: success', async () => {
      const { signersRegistry, signerAdmin, admin, anyUser } = await loadFixture(deploySignersRegistry);
      const signers = [anyUser.address];

      await signersRegistry.connect(admin).addPrivateSignerAdmin(signerAdmin.address);

      expect(await signersRegistry.isPrivateWhitelisted(signerAdmin.address, anyUser.address)).to.be.equal(false);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners(signers))
        .to.emit(signersRegistry, 'PrivateSignersSet')
        .withArgs(signerAdmin.address, signers);

      expect(await signersRegistry.isPrivateWhitelisted(signerAdmin.address, anyUser.address)).to.be.equal(true);
    });

    it('Signer address is not whitelisted because signerAdmin removed it: success', async () => {
      const { signersRegistry, signerAdmin, admin, anyUser } = await loadFixture(deploySignersRegistry);
      const signers = [anyUser.address, admin.address];

      await signersRegistry.connect(admin).addPrivateSignerAdmin(signerAdmin.address);
      await signersRegistry.connect(signerAdmin).setPrivateSigners(signers);

      expect(await signersRegistry.isPrivateWhitelisted(signerAdmin.address, admin.address)).to.be.equal(true);
      expect(await signersRegistry.isPrivateWhitelisted(signerAdmin.address, anyUser.address)).to.be.equal(true);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners([admin.address]))
        .to.emit(signersRegistry, 'PrivateSignersSet')
        .withArgs(signerAdmin.address, [admin.address]);

      expect(await signersRegistry.isPrivateWhitelisted(signerAdmin.address, admin.address)).to.be.equal(true);
      expect(await signersRegistry.isPrivateWhitelisted(signerAdmin.address, anyUser.address)).to.be.equal(false);
    });

    it('Remove private signers: success', async () => {
      const { signersRegistry, signerAdmin, anyUser, admin } = await loadFixture(deploySignersRegistry);

      await signersRegistry.connect(admin).addPrivateSignerAdmin(signerAdmin.address);
      expect(await signersRegistry.privateSignerAdmin(signerAdmin.address)).to.be.equal(true);

      await signersRegistry.connect(signerAdmin).setPrivateSigners([anyUser.address]);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners([]))
        .to.be.emit(signersRegistry, 'PrivateSignersSet')
        .withArgs(signerAdmin.address, []);
    });

    it('Remove private signers: failed because initiator is not signerAdmin', async () => {
      const { signersRegistry, signerAdmin } = await loadFixture(deploySignersRegistry);

      expect(await signersRegistry.privateSignerAdmin(signerAdmin.address)).to.be.equal(false);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners([])).to.be.revertedWith(
        'Caller is not the signer admin'
      );
    });

    it('Add private signers for signerAdmin: failed because admin removed signerAdmin', async () => {
      const { signersRegistry, signerAdmin, admin, anyUser } = await loadFixture(deploySignersRegistry);
      const signers = [anyUser.address];

      await signersRegistry.connect(admin).addPrivateSignerAdmin(signerAdmin.address);
      await signersRegistry.connect(signerAdmin).setPrivateSigners(signers);
      await signersRegistry.connect(admin).removePrivateSignerAdmin(signerAdmin.address);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners(signers)).to.be.revertedWith(
        'Caller is not the signer admin'
      );
    });

    it('Remove private signers for signerAdmin: failed because admin removed signerAdmin', async () => {
      const { signersRegistry, signerAdmin, admin } = await loadFixture(deploySignersRegistry);

      await signersRegistry.connect(admin).addPrivateSignerAdmin(signerAdmin.address);
      await signersRegistry.connect(signerAdmin).setPrivateSigners([]);
      await signersRegistry.connect(admin).removePrivateSignerAdmin(signerAdmin.address);

      await expect(signersRegistry.connect(signerAdmin).setPrivateSigners([])).to.be.revertedWith(
        'Caller is not the signer admin'
      );
    });
  });
});

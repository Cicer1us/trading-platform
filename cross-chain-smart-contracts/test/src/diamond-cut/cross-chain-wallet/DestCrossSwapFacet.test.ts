import { connectorTokens, SmartContracts, usdcToken } from '@bitoftrade/cross-chain-core';
import { loadFixture, impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';
import { ethers, upgrades } from 'hardhat';
import { SwapSide } from '@paraswap/sdk';
import { Wallet } from 'ethers';
import { FacetCut } from 'hardhat-deploy/dist/types';
import walletFacetsDeployArgs from '../../../../scripts/deploy/diamond-cut/cross-chain-wallet/params';
import { deployFacet, deployFacetWithInitData } from '../../../../scripts/deploy/diamond-cut/utils';
import {
  DestCrossSwapFacet__factory,
  LibDestCrossSwap__factory,
  SignersRegistry,
  SignersRegistryFacet__factory,
} from '../../../../typechain';
import { createSrcSwapSignature, generateCalldataForSwap, SrcCrossSwapEvent } from '../../../utils';
import { expect } from '../../../utils/chai-setup';
import { DAI } from '../../../utils/constants';
import erc20abi from '../../../data/erc20.json';

describe('DestCrossSwapFacet', () => {
  const chainId = 1;
  const crossChainRouterEvent = 'SrcCrossSwap';
  const crossChainWalletEvent = 'DestCrossSwap';

  async function impersonateAddress(address: string) {
    await impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);
    return impersonatedSigner;
  }

  async function depositFundsToWallet() {
    const { usdc, user, crossChainWallet } = await loadFixture(deployFacets);
    await user.sendTransaction({
      to: usdc.address,
      data: usdc.interface.encodeFunctionData('transfer', [crossChainWallet.address, '10000000000']),
      from: user.address,
    });
  }

  async function deployFacets() {
    const [owner, wrongWalletSwapProvider, wrongConnectorToken, anyUser] = await ethers.getSigners();

    const user = await impersonateAddress('0x5b990c664ae7e759763acfec76e11c289c53be77');

    const signersRegistry = Wallet.createRandom();

    const SignersRegistry = await ethers.getContractFactory('SignersRegistry');
    const signersRegistryContract = (await upgrades.deployProxy(SignersRegistry, [owner.address], {
      initializer: 'initialize',
      kind: 'uups',
    })) as SignersRegistry;

    await signersRegistryContract.connect(owner).addPublicSigner(signersRegistry.address);

    const usdc = new ethers.Contract(
      connectorTokens[chainId][usdcToken[chainId].address].address,
      erc20abi,
      ethers.provider
    );

    const cuts: FacetCut[] = [];

    const requiredFacetNames = [
      'DiamondCutFacet',
      'DiamondLoupeFacet',
      'OwnershipFacet',
      'DestCrossSwapFacet',
      'SignersRegistryFacet',
    ];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainWallet = await ethers.getContractFactory('CrossChainWallet');
    const crossChainWallet = await CrossChainWallet.deploy(cuts, owner.address);
    await crossChainWallet.deployed();

    const destCrossSwapFacet = DestCrossSwapFacet__factory.connect(crossChainWallet.address, owner);

    //top up CrossChainWallet by 10 000 USDC

    for (const facet of walletFacetsDeployArgs[chainId]) {
      if (facet.facetName === 'SignersRegistryFacet') continue;
      await deployFacetWithInitData(crossChainWallet.address, facet.facetName, facet.initMethod, facet.initArgs);
    }

    const signersRegistryFacet = SignersRegistryFacet__factory.connect(crossChainWallet.address, owner);

    const libDestCrossSwap = LibDestCrossSwap__factory.connect(crossChainWallet.address, owner);

    await signersRegistryFacet.setSignersRegistry(signersRegistryContract.address);

    return {
      usdc,
      user,
      owner,
      anyUser,
      signersRegistry,
      crossChainWallet,
      libDestCrossSwap,
      destCrossSwapFacet,
      wrongConnectorToken,
      wrongWalletSwapProvider,
    };
  }

  describe('Arbitrary transaction', () => {
    it('withdraw connector token(USDC) from CrossChainWallet', async () => {
      const { owner, usdc, destCrossSwapFacet, anyUser } = await loadFixture(deployFacets);
      await depositFundsToWallet();
      const usdcAmount = '10000000';

      const crossChainWalletBalanceBeforeTx = await usdc.balanceOf(destCrossSwapFacet.address);

      const arbitraryCalldata = usdc.interface.encodeFunctionData('transfer', [anyUser.address, usdcAmount]);
      const to = usdc.address;

      await expect(destCrossSwapFacet.connect(owner).execute(to, 0, arbitraryCalldata)).to.be.not.reverted;

      const crossChainWalletBalanceAfterTx = await usdc.balanceOf(destCrossSwapFacet.address);

      const anyUserBalanceAfterTransfer = await usdc.balanceOf(anyUser.address);
      expect(anyUserBalanceAfterTransfer.toString()).to.be.equal(usdcAmount);
      expect(crossChainWalletBalanceBeforeTx.sub(crossChainWalletBalanceAfterTx).toString()).to.be.equal(usdcAmount);
    });

    it('withdraw connector token(USDC) failed due to non owner caller', async () => {
      const { usdc, destCrossSwapFacet, anyUser } = await loadFixture(deployFacets);
      await depositFundsToWallet();
      const usdcAmount = '10000000';

      const arbitraryCalldata = usdc.interface.encodeFunctionData('transfer', [anyUser.address, usdcAmount]);
      const to = usdc.address;

      await expect(destCrossSwapFacet.connect(anyUser).execute(to, 0, arbitraryCalldata)).to.be.revertedWith(
        'LibDiamond: Must be contract owner'
      );
    });

    it('withdraw connector token(USDC) failed due to insufficient balance', async () => {
      const { owner, usdc, destCrossSwapFacet, anyUser } = await loadFixture(deployFacets);
      const usdcAmount = '10000000';

      const arbitraryCalldata = usdc.interface.encodeFunctionData('transfer', [anyUser.address, usdcAmount]);
      const to = usdc.address;

      await expect(destCrossSwapFacet.connect(owner).execute(to, 0, arbitraryCalldata)).to.be.revertedWith(
        'Arbitrary tx failed'
      );
    });
  });

  describe('Refund Src transaction', () => {
    const srcTxHash = '0x65fdcf0fa699003193ad2ee9b0fbc7c15ef9f7aba037b37e19ba24e536d40346';
    const srcChainId = 137;

    const srcEventTemplate: Omit<SrcCrossSwapEvent, 'destUser' | 'destToken' | 'minDestAmount' | 'refundAddress'> = {
      chainId: srcChainId,
      txHash: srcTxHash,
      srcToken: usdcToken[srcChainId].address,
      srcAmount: '10000000',
      destChainId: chainId,
      connectorToken: connectorTokens[srcChainId][usdcToken[srcChainId].address].address,
      connectorTokenIncome: '10000000',
      liquidityProvider: 'bitoftrade',
    };

    it('successful refundSrcTransaction', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, libDestCrossSwap } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      const userBalanceBeforeRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceBeforeRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      await expect(destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event))
        .to.emit(libDestCrossSwap, 'DestCrossSwap')
        .withArgs(
          srcChainId,
          srcTxHash,
          ethers.utils.getAddress(event.srcToken),
          event.srcAmount,
          ethers.utils.getAddress(event.destToken),
          event.minDestAmount,
          event.destUser,
          ethers.utils.getAddress(usdc.address),
          event.minDestAmount,
          'bitoftrade'
        );

      const userBalanceAfterRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceAfterRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      expect(userBalanceAfterRefund.sub(userBalanceBeforeRefund).toString()).to.equal(event.connectorTokenIncome);
      expect(crossChainWalletBalanceBeforeRefund.sub(crossChainWalletBalanceAfterRefund).toString()).to.equal(
        event.connectorTokenIncome
      );
    });

    it('successful refundSrcTransaction - BinanceSmartChain to Mainnet', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, libDestCrossSwap } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const usdcAmount = (1 * 10 ** 18).toString();
      const usdcOutcome = (1 * 10 ** 6).toString();

      const event: SrcCrossSwapEvent = {
        chainId: 56,
        txHash: srcTxHash,
        srcToken: usdcToken[56].address,
        srcAmount: usdcAmount,
        destChainId: chainId,
        connectorToken: usdcToken[56].address,
        connectorTokenIncome: usdcAmount,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: usdcOutcome,
        refundAddress: user.address,
        liquidityProvider: 'bitoftrade',
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[56].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      const userBalanceBeforeRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceBeforeRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      await expect(destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event))
        .to.emit(libDestCrossSwap, 'DestCrossSwap')
        .withArgs(
          56,
          srcTxHash,
          ethers.utils.getAddress(event.srcToken),
          event.srcAmount,
          ethers.utils.getAddress(event.destToken),
          event.minDestAmount,
          event.destUser,
          ethers.utils.getAddress(usdc.address),
          event.minDestAmount,
          'bitoftrade'
        );

      const userBalanceAfterRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceAfterRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      expect(userBalanceAfterRefund.sub(userBalanceBeforeRefund).toString()).to.equal(usdcOutcome);
      expect(crossChainWalletBalanceBeforeRefund.sub(crossChainWalletBalanceAfterRefund).toString()).to.equal(
        usdcOutcome
      );
    });

    it('failed refundSrcTransaction - signature signer is not whitelisted', async () => {
      const { destCrossSwapFacet, user, usdc } = await loadFixture(deployFacets);
      await depositFundsToWallet();
      const anySigner = Wallet.createRandom();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: anySigner,
      });

      await expect(
        destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event)
      ).to.be.revertedWith('Signer is not whitelisted');
    });

    it('failed refundSrcTransaction - double spending', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      await destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event);

      await expect(
        destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event)
      ).to.be.revertedWith('SrcCrossSwap was already completed');

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          usdc.address
        )
      ).to.be.revertedWith('SrcCrossSwap was already completed');
    });

    it('failed refundSrcTransaction - caller is not refund address', async () => {
      const { destCrossSwapFacet, user, usdc, anyUser } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const anySigner = Wallet.createRandom();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: anySigner,
      });

      await expect(
        destCrossSwapFacet.connect(anyUser).refundSrcTransaction(signature, usdc.address, event)
      ).to.be.revertedWith('Caller is not refund address');
    });

    it('failed refundSrcTransaction - refund token is not whitelisted', async () => {
      const { destCrossSwapFacet, user, usdc, wrongConnectorToken } = await loadFixture(deployFacets);
      await depositFundsToWallet();
      const anySigner = Wallet.createRandom();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: anySigner,
      });

      await expect(
        destCrossSwapFacet.connect(user).refundSrcTransaction(signature, wrongConnectorToken.address, event)
      ).to.be.revertedWith('Refund token is not whitelisted');
    });
  });

  describe('Finish Cross Swap', () => {
    const srcTxHash = '0x65fdcf0fa699003193ad2ee9b0fbc7c15ef9f7aba037b37e19ba24e536d40346';
    const srcChainId = 137;

    const srcEventTemplate: Omit<SrcCrossSwapEvent, 'destUser' | 'destToken' | 'minDestAmount' | 'refundAddress'> = {
      chainId: srcChainId,
      txHash: srcTxHash,
      srcToken: usdcToken[srcChainId].address,
      srcAmount: '10000000',
      destChainId: chainId,
      connectorToken: connectorTokens[srcChainId][usdcToken[srcChainId].address].address,
      connectorTokenIncome: '10000000',
      liquidityProvider: 'bitoftrade',
    };

    it('successful finishCrossSwap - connector token(USDC) to USDC', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, libDestCrossSwap } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      const userBalanceBeforeRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceBeforeRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          usdc.address
        )
      )
        .to.emit(libDestCrossSwap, 'DestCrossSwap')
        .withArgs(
          srcChainId,
          srcTxHash,
          ethers.utils.getAddress(event.srcToken),
          event.srcAmount,
          ethers.utils.getAddress(event.destToken),
          event.minDestAmount,
          event.destUser,
          ethers.utils.getAddress(usdc.address),
          event.minDestAmount,
          'bitoftrade'
        );

      const userBalanceAfterRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceAfterRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      expect(userBalanceAfterRefund.sub(userBalanceBeforeRefund).toString()).to.equal(event.connectorTokenIncome);
      expect(crossChainWalletBalanceBeforeRefund.sub(crossChainWalletBalanceAfterRefund).toString()).to.equal(
        event.connectorTokenIncome
      );
    });

    it('successful finishCrossSwap - connector token(USDC) to DAI', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, libDestCrossSwap } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const dai = new ethers.Contract(DAI, erc20abi, ethers.provider);

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: DAI,
        minDestAmount: (9 * 10 ** 18).toString(),
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      const userBalanceBeforeSwap = await dai.balanceOf(event.destUser);
      const crossChainWalletBalanceBeforeSwap = await usdc.balanceOf(destCrossSwapFacet.address);

      const swap = await generateCalldataForSwap({
        chainId,
        amount: event.minDestAmount,
        userAddress: destCrossSwapFacet.address,
        receiver: event.destUser,
        srcToken: usdc.address,
        destToken: event.destToken,
        side: SwapSide.BUY,
      });

      const tx = await destCrossSwapFacet.connect(user).finishCrossSwap(
        event,
        {
          provider: SmartContracts[chainId].paraswapSwapProvider,
          approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
          callData: swap.data,
        },
        signature,
        usdc.address
      );

      const result = await tx.wait();

      const targetEventLog = result.logs?.find(
        (log) => log.address.toLowerCase() === libDestCrossSwap.address.toLowerCase()
      );

      if (targetEventLog) {
        const decodedLog = libDestCrossSwap.interface.parseLog(targetEventLog);

        expect(decodedLog.name).to.be.equal(crossChainWalletEvent);
        expect(decodedLog.args.srcChainId).to.be.equal(srcChainId);
        expect(decodedLog.args.srcTransactionHash).to.be.equal(srcTxHash);
        expect(decodedLog.args.srcToken).to.be.equal(ethers.utils.getAddress(event.srcToken));
        expect(decodedLog.args.srcAmount.toString()).to.be.equal(event.srcAmount);
        expect(decodedLog.args.destToken).to.be.equal(ethers.utils.getAddress(event.destToken));
        expect(Number(decodedLog.args.destAmount.toString())).to.be.greaterThanOrEqual(Number(event.minDestAmount));
        expect(decodedLog.args.destUser).to.be.equal(event.destUser);
        expect(decodedLog.args.connectorToken).to.be.equal(ethers.utils.getAddress(usdc.address));
        expect(Number(decodedLog.args.connectorTokenOutcome.toString())).to.be.greaterThan(0);
        expect(decodedLog.args.liquidityProvider).to.be.equal('bitoftrade');

        const userBalanceAfterSwap = await dai.balanceOf(event.destUser);
        const crossChainWalletBalanceAfterSwap = await usdc.balanceOf(destCrossSwapFacet.address);

        expect(userBalanceAfterSwap.sub(userBalanceBeforeSwap)).to.be.equal(decodedLog.args.destAmount.toString());
        expect(crossChainWalletBalanceBeforeSwap.sub(crossChainWalletBalanceAfterSwap)).to.be.equal(
          decodedLog.args.connectorTokenOutcome.toString()
        );
      }
    });

    it('successful finishCrossSwap - BinanceSmartChain to Mainnet', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, libDestCrossSwap } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const usdcAmount = (1 * 10 ** 18).toString();
      const usdcOutcome = (1 * 10 ** 6).toString();

      const event: SrcCrossSwapEvent = {
        chainId: 56,
        txHash: srcTxHash,
        srcToken: usdcToken[56].address,
        srcAmount: usdcAmount,
        destChainId: chainId,
        connectorToken: usdcToken[56].address,
        connectorTokenIncome: usdcAmount,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: usdcOutcome,
        refundAddress: user.address,
        liquidityProvider: 'bitoftrade',
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[56].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      const userBalanceBeforeRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceBeforeRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          usdc.address
        )
      )
        .to.emit(libDestCrossSwap, 'DestCrossSwap')
        .withArgs(
          56,
          srcTxHash,
          ethers.utils.getAddress(event.srcToken),
          event.srcAmount,
          ethers.utils.getAddress(event.destToken),
          event.minDestAmount,
          event.destUser,
          ethers.utils.getAddress(usdc.address),
          event.minDestAmount,
          'bitoftrade'
        );

      const userBalanceAfterRefund = await usdc.balanceOf(event.destUser);
      const crossChainWalletBalanceAfterRefund = await usdc.balanceOf(destCrossSwapFacet.address);

      expect(userBalanceAfterRefund.sub(userBalanceBeforeRefund).toString()).to.equal(usdcOutcome);
      expect(crossChainWalletBalanceBeforeRefund.sub(crossChainWalletBalanceAfterRefund).toString()).to.equal(
        usdcOutcome
      );
    });

    it('failed finishCrossSwap - double spending', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      await destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event);

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          usdc.address
        )
      ).to.be.revertedWith('SrcCrossSwap was already completed');
    });

    it('failed finishCrossSwap - signature signer is not whitelisted', async () => {
      const { destCrossSwapFacet, user, usdc } = await loadFixture(deployFacets);
      await depositFundsToWallet();
      const anySigner = Wallet.createRandom();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: anySigner,
      });

      await expect(
        destCrossSwapFacet.connect(user).refundSrcTransaction(signature, usdc.address, event)
      ).to.be.revertedWith('Signer is not whitelisted');
    });

    it('failed finishCrossSwap - user received less then expected', async () => {
      const { destCrossSwapFacet, user, usdc, signersRegistry } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: DAI,
        minDestAmount: (9 * 10 ** 18).toString(),
        refundAddress: user.address,
      };

      const actualDestAmount = (Number(event?.minDestAmount) - 10000000).toString();

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      const swap = await generateCalldataForSwap({
        chainId,
        amount: actualDestAmount,
        userAddress: destCrossSwapFacet.address,
        receiver: event.destUser,
        srcToken: usdc.address,
        destToken: event.destToken,
        side: SwapSide.BUY,
      });

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: swap.data,
          },
          signature,
          usdc.address
        )
      ).to.be.revertedWith('User received less then expected');
    });

    it('failed finishCrossSwap - outcome should be not less than income', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '100000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          usdc.address
        )
      ).to.be.revertedWith('Outcome should be not less than income');
    });

    it('failed finishCrossSwap - connector token is not whitelisted', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, wrongConnectorToken } = await loadFixture(deployFacets);
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: usdc.address,
        minDestAmount: '10000000',
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: SmartContracts[chainId].paraswapSwapProvider,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          wrongConnectorToken.address
        )
      ).to.be.revertedWith('ConnectorToken token is not whitelisted');
    });

    it('failed finishCrossSwap - swap provider is not whitelisted', async () => {
      const { usdc, destCrossSwapFacet, user, signersRegistry, wrongWalletSwapProvider } = await loadFixture(
        deployFacets
      );
      await depositFundsToWallet();

      const event: SrcCrossSwapEvent = {
        ...srcEventTemplate,
        destUser: user.address,
        destToken: DAI,
        minDestAmount: (9 * 10 ** 18).toString(),
        refundAddress: user.address,
      };

      const signature = createSrcSwapSignature({
        eventName: crossChainRouterEvent,
        crossChainRouter: SmartContracts[srcChainId].crossChainRouter,
        event,
        wallet: signersRegistry,
      });

      await expect(
        destCrossSwapFacet.connect(user).finishCrossSwap(
          event,
          {
            provider: wrongWalletSwapProvider.address,
            approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
            callData: '0x',
          },
          signature,
          usdc.address
        )
      ).to.be.revertedWith('Swap provider is not whitelisted');
    });
  });
});

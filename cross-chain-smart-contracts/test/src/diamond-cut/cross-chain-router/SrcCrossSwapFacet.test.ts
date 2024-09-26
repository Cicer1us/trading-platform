import { loadFixture, impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';
import { connectorTokens, usdcToken, SmartContracts } from '@bitoftrade/cross-chain-core';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import {
  SrcCrossSwapFacet__factory,
  LibSrcCrossSwap__factory,
  ConnectorTokenHolderFacet__factory,
  ConnectorTokenHolderFacet,
  ConnectorTokensFacet__factory,
  RouterSwapProvidersFacet__factory,
} from '../../../../typechain';
import { expect } from '../../../utils/chai-setup';
import { DAI, ETH, MAX_UINT } from '../../../utils/constants';
import erc20abi from '../../../data/erc20.json';
import { generateCalldataForSwap } from '../../../utils';

describe('SrcCrossSwapFacet', () => {
  const chainId = 1;
  const crossChainRouterEvent = 'SrcCrossSwap';

  async function impersonateAddress(address: string) {
    await impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);
    return impersonatedSigner;
  }

  async function deployNeededFacetsWithInitData() {
    const [owner, connectorTokenHolder, wrongRouterSwapProvider, wrongConnectorToken] = await ethers.getSigners();

    const someUser = await impersonateAddress('0x5b990c664ae7e759763acfec76e11c289c53be77');

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
      'SrcCrossSwapFacet',
      'ConnectorTokenHolderFacet',
      'ConnectorTokensFacet',
      'RouterSwapProvidersFacet',
    ];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();

    const srcCrossSwapFacet = SrcCrossSwapFacet__factory.connect(crossChainRouter.address, owner);
    const connectorTokenHolderFacet = ConnectorTokenHolderFacet__factory.connect(crossChainRouter.address, owner);
    const connectorTokensFacet = ConnectorTokensFacet__factory.connect(crossChainRouter.address, owner);
    const routerSwapProvidersFacet = RouterSwapProvidersFacet__factory.connect(crossChainRouter.address, owner);
    const libSrcCrossSwap = LibSrcCrossSwap__factory.connect(crossChainRouter.address, owner);

    const connectorTokenHolders: ConnectorTokenHolderFacet.ConnectorTokenHolderArgsStruct[] = [
      {
        holder: connectorTokenHolder.address,
        chainId: 1,
      },
      {
        holder: connectorTokenHolder.address,
        chainId: 56,
      },
    ];

    await connectorTokenHolderFacet.addConnectorTokenHolders(connectorTokenHolders);
    await connectorTokensFacet.addWhitelistedConnectorToken(
      connectorTokens[chainId][usdcToken[chainId].address].address
    );
    await routerSwapProvidersFacet.addWhitelistedSwapProvider(SmartContracts[chainId].paraswapSwapProvider);

    return {
      someUser,
      wrongRouterSwapProvider,
      wrongConnectorToken,
      usdc,
      srcCrossSwapFacet,
      connectorTokenHolderFacet,
      libSrcCrossSwap,
    };
  }

  describe('Direct Connector Token(USDC) transfer', () => {
    const srcToken = connectorTokens[chainId][usdcToken[chainId].address].address;
    const destChainId = 56;
    const destToken = ETH;
    const minDestAmount = '1000000000000000';

    async function createDirectUsdcTransferTx(srcAmount: string, connectorTokenAddress: string) {
      const { srcCrossSwapFacet, someUser, usdc } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      await someUser.sendTransaction({
        to: usdc.address,
        data: usdc.interface.encodeFunctionData('approve', [srcCrossSwapFacet.address, MAX_UINT]),
        from: userAddress,
      });

      return srcCrossSwapFacet.connect(someUser).initCrossSwap(
        {
          srcToken,
          srcAmount,
          destChainId,
          destToken,
          minDestAmount,
          destUser: userAddress,
          connectorToken: connectorTokenAddress,
          refundAddress: userAddress,
        },
        {
          provider: SmartContracts[chainId].paraswapSwapProvider,
          approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
          callData: '0x',
        },
        {
          from: userAddress,
          value: 0,
        }
      );
    }
    it('successfully give approve to CrossChainRouter', async () => {
      const { someUser, srcCrossSwapFacet, usdc } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      const ethBalanceBeforeSwap = await someUser.getBalance();
      const allowanceBeforeSwap = await usdc.allowance(userAddress, srcCrossSwapFacet.address);

      const approveCalldata = usdc.interface.encodeFunctionData('approve', [srcCrossSwapFacet.address, MAX_UINT]);
      await someUser.sendTransaction({
        to: usdc.address,
        data: approveCalldata,
        from: userAddress,
      });

      const ethBalanceAfterSwap = await someUser.getBalance();
      const allowanceAfterSwap = await usdc.allowance(userAddress, srcCrossSwapFacet.address);

      expect(ethBalanceAfterSwap.lt(ethBalanceBeforeSwap)).to.be.equal(true);
      expect(Number(allowanceAfterSwap)).to.be.greaterThan(Number(allowanceBeforeSwap));
    });

    it('successful initCrossSwap - direct connector token(USDC) transfer on src network', async () => {
      const { someUser, usdc, connectorTokenHolderFacet, libSrcCrossSwap } = await loadFixture(
        deployNeededFacetsWithInitData
      );

      const connectorTokenHolder = await connectorTokenHolderFacet.connectorTokenHolder(chainId);
      const userAddress = await someUser.getAddress();

      const usdcBalanceBeforeSwap = await usdc.balanceOf(userAddress);
      const tokenHolderBalanceBeforeSwap = await usdc.balanceOf(connectorTokenHolder);

      const usdcAmount = '100000000';
      const tx = createDirectUsdcTransferTx(usdcAmount, connectorTokens[chainId][usdcToken[chainId].address].address);

      await expect(tx).to.emit(libSrcCrossSwap, crossChainRouterEvent).withArgs(
        ethers.utils.getAddress(srcToken),
        usdcAmount,
        destChainId,
        destToken,
        minDestAmount,
        userAddress,
        ethers.utils.getAddress(connectorTokens[chainId][usdcToken[chainId].address].address),
        usdcAmount, //connector token income should be the same as srcAmount in this case
        userAddress,
        'bitoftrade'
      );

      const usdcBalanceAfterSwap = await usdc.balanceOf(userAddress);
      const tokenHolderBalanceAfterSwap = await usdc.balanceOf(connectorTokenHolder);

      expect(usdcBalanceBeforeSwap.sub(usdcBalanceAfterSwap).toString()).to.be.equal(usdcAmount);
      expect(tokenHolderBalanceAfterSwap.sub(tokenHolderBalanceBeforeSwap).toString()).to.be.equal(usdcAmount);
    });

    it('failed initCrossSwap - direct connector token(USDC) transfer reverted because of 0 connector token income', async () => {
      const usdcAmount = '0';
      const tx = createDirectUsdcTransferTx(usdcAmount, connectorTokens[chainId][usdcToken[chainId].address].address);
      await expect(tx).to.be.revertedWith('Connector Token income should be positive');
    });

    it('failed initCrossSwap - incorrect connector token address', async () => {
      const { wrongConnectorToken } = await loadFixture(deployNeededFacetsWithInitData);
      const usdcAmount = '100000000';
      const tx = createDirectUsdcTransferTx(usdcAmount, wrongConnectorToken.address);
      await expect(tx).to.be.revertedWith('Connector token is not whitelisted');
    });
  });

  describe('ETH(native token) to any token', () => {
    const srcToken = ETH;
    const destChainId = 56;
    const destTokenOnSrcSwap = usdcToken[chainId].address;
    const destTokenCrossChain = usdcToken[destChainId].address;
    const minDestAmount = '1000000000';

    async function createEthSwap(srcAmount: string, srcSwapProvider: string, destTokenAddress?: string) {
      const { srcCrossSwapFacet, someUser } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      const txParams = await generateCalldataForSwap({
        chainId,
        srcToken,
        amount: srcAmount,
        destToken: destTokenAddress ?? destTokenOnSrcSwap,
        userAddress,
      });

      return srcCrossSwapFacet.connect(someUser).initCrossSwap(
        {
          srcToken,
          srcAmount,
          destChainId,
          destToken: destTokenCrossChain,
          minDestAmount,
          destUser: userAddress,
          connectorToken: connectorTokens[chainId][usdcToken[chainId].address].address,
          refundAddress: userAddress,
        },
        {
          provider: srcSwapProvider,
          approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
          callData: txParams.data,
        },
        {
          from: userAddress,
          value: txParams.value,
        }
      );
    }

    it('successful initCrossSwap - eth to connector token on src network', async () => {
      const { someUser, usdc, connectorTokenHolderFacet, libSrcCrossSwap } = await loadFixture(
        deployNeededFacetsWithInitData
      );

      const connectorTokenHolder = await connectorTokenHolderFacet.connectorTokenHolder(chainId);
      const userBalanceBeforeSwap = await someUser.getBalance();
      const connectorTokenHolderBalanceBeforeSwap = await usdc.balanceOf(connectorTokenHolder);

      const ethAmount = '10000000000000';
      const tx = await createEthSwap(ethAmount, SmartContracts[chainId].paraswapSwapProvider);
      const result = await tx.wait();

      const targetEventLog = result.logs?.find(
        (log) => log.address.toLowerCase() === libSrcCrossSwap.address.toLowerCase()
      );
      if (targetEventLog) {
        const decodedLog = libSrcCrossSwap.interface.parseLog(targetEventLog);

        expect(decodedLog.name).to.be.equal(crossChainRouterEvent);
        expect(decodedLog.args.srcToken).to.be.equal(srcToken);
        expect(decodedLog.args.srcAmount.toString()).to.be.equal(ethAmount);
        expect(decodedLog.args.destChainId).to.be.equal(destChainId);
        expect(decodedLog.args.minDestAmount.toString()).to.be.equal(minDestAmount);
        expect(decodedLog.args.destUser).to.be.equal(someUser.address);
        expect(decodedLog.args.connectorToken).to.be.equal(
          ethers.utils.getAddress(connectorTokens[chainId][usdcToken[chainId].address].address)
        );
        expect(decodedLog.args.connectorTokenIncome.toString()).not.to.be.equal('0');
        expect(decodedLog.args.refundAddress).to.be.equal(ethers.utils.getAddress(someUser.address));
        expect(decodedLog.args.liquidityProvider).to.be.equal('bitoftrade');

        const userBalanceAfterSwap = await someUser.getBalance();
        const connectorTokenHolderBalanceAfterSwap = await usdc.balanceOf(connectorTokenHolder);

        expect(connectorTokenHolderBalanceAfterSwap.sub(connectorTokenHolderBalanceBeforeSwap).toString()).to.be.equal(
          decodedLog.args.connectorTokenIncome.toString()
        );
        expect(Number(userBalanceBeforeSwap)).to.be.greaterThan(Number(userBalanceAfterSwap));
      }
    });
    it('failed initCrossSwap - reverted because of 0 connector token(USDC) income in eth to any case', async () => {
      const ethAmount = '10000000000000';
      const tx = createEthSwap(ethAmount, SmartContracts[chainId].paraswapSwapProvider, DAI);
      await expect(tx).to.be.revertedWith('Connector Token income should be positive');
    });

    it('failed initCrossSwap - incorrect src swap provider address', async () => {
      const { wrongRouterSwapProvider } = await loadFixture(deployNeededFacetsWithInitData);
      const ethAmount = '10000000000000';
      const tx = createEthSwap(ethAmount, wrongRouterSwapProvider.address);
      await expect(tx).to.be.revertedWith('Swap provider is not whitelisted');
    });
  });

  describe('Any token to any token', () => {
    const srcToken = DAI;
    const destChainId = 56;
    const destTokenOnSrcSwap = usdcToken[chainId].address;
    const destTokenCrossChain = usdcToken[destChainId].address;
    const minDestAmount = '10000000000';

    async function createAnySwap(srcAmount: string, destTokenAddress?: string) {
      const { srcCrossSwapFacet, someUser, usdc } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      await someUser.sendTransaction({
        to: srcToken,
        data: usdc.interface.encodeFunctionData('approve', [srcCrossSwapFacet.address, MAX_UINT]),
        from: userAddress,
      });

      const txParams = await generateCalldataForSwap({
        chainId,
        srcToken,
        amount: srcAmount,
        destToken: destTokenAddress ?? destTokenOnSrcSwap,
        userAddress,
      });

      return srcCrossSwapFacet.connect(someUser).initCrossSwap(
        {
          srcToken,
          srcAmount,
          destChainId,
          destToken: destTokenCrossChain,
          minDestAmount,
          destUser: userAddress,
          connectorToken: connectorTokens[chainId][usdcToken[chainId].address].address,
          refundAddress: userAddress,
        },
        {
          provider: SmartContracts[chainId].paraswapSwapProvider,
          approveProxy: SmartContracts[chainId].paraswapApproveProxyAddress,
          callData: txParams.data,
        },
        {
          from: userAddress,
          value: txParams.value,
        }
      );
    }

    it('successful initCrossSwap - any token to any token', async () => {
      const { someUser, usdc, connectorTokenHolderFacet, libSrcCrossSwap } = await loadFixture(
        deployNeededFacetsWithInitData
      );

      const connectorTokenHolder = await connectorTokenHolderFacet.connectorTokenHolder(chainId);
      const userBalanceBeforeSwap = await someUser.getBalance();
      const connectorTokenHolderBalanceBeforeSwap = await usdc.balanceOf(connectorTokenHolder);

      const amount = '100000000000000000000';
      const tx = await createAnySwap(amount);
      const result = await tx.wait();

      const targetEventLog = result.logs?.find(
        (log) => log.address.toLowerCase() === libSrcCrossSwap.address.toLowerCase()
      );
      if (targetEventLog) {
        const decodedLog = libSrcCrossSwap.interface.parseLog(targetEventLog);

        expect(decodedLog.name).to.be.equal(crossChainRouterEvent);
        expect(decodedLog.args.srcToken).to.be.equal(srcToken);
        expect(decodedLog.args.srcAmount.toString()).to.be.equal(amount);
        expect(decodedLog.args.destChainId).to.be.equal(destChainId);
        expect(decodedLog.args.minDestAmount.toString()).to.be.equal(minDestAmount);
        expect(decodedLog.args.destUser).to.be.equal(someUser.address);
        expect(decodedLog.args.connectorToken).to.be.equal(
          ethers.utils.getAddress(connectorTokens[chainId][usdcToken[chainId].address].address)
        );
        expect(decodedLog.args.connectorTokenIncome.toString()).not.to.be.equal('0');
        expect(decodedLog.args.refundAddress).to.be.equal(ethers.utils.getAddress(someUser.address));
        expect(decodedLog.args.liquidityProvider).to.be.equal('bitoftrade');

        const userBalanceAfterSwap = await someUser.getBalance();
        const connectorTokenHolderBalanceAfterSwap = await usdc.balanceOf(connectorTokenHolder);

        expect(connectorTokenHolderBalanceAfterSwap.sub(connectorTokenHolderBalanceBeforeSwap).toString()).to.be.equal(
          decodedLog.args.connectorTokenIncome.toString()
        );
        expect(Number(userBalanceBeforeSwap)).to.be.greaterThan(Number(userBalanceAfterSwap));
      }
    });

    it('failed initCrossSwap - reverted because of 0 connector token(USDC) income in any to any case', async () => {
      const amount = '10000000000000';
      const tx = createAnySwap(amount, ETH);
      await expect(tx).to.be.revertedWith('Connector Token income should be positive');
    });
  });
});

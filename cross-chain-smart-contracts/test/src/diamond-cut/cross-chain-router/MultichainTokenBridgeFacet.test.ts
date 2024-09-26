import { loadFixture, impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';
import { connectorTokens, usdcToken, SmartContracts } from '@bitoftrade/cross-chain-core';
import { ethers } from 'hardhat';
import { FacetCut } from 'hardhat-deploy/dist/types';
import { deployFacet } from '../../../../scripts/deploy/diamond-cut/utils';
import {
  MultichainTokenBridgeFacet__factory,
  LibSrcCrossSwap__factory,
  ConnectorTokenHolderFacet__factory,
  ConnectorTokenHolderFacet,
  ConnectorTokensFacet__factory,
  RouterSwapProvidersFacet__factory,
  MultichainConnectorTokensFacet__factory,
  MultichainRoutersFacet__factory,
  IMultichainRouter__factory,
} from '../../../../typechain';
import erc20abi from '../../../data/erc20.json';
import { DAI, ETH, MAX_UINT } from '../../../utils/constants';
import { expect } from '../../../utils/chai-setup';
import { generateCalldataForSwap } from '../../../utils';

describe('MultichainTokenBridgeFacet', () => {
  const chainId = 1;
  const crossChainRouterEvent = 'SrcCrossSwap';
  const multichainRouterEvent = 'LogAnySwapOut';
  const multichainAnyUsdcMainnet = '0x7ea2be2df7ba6e54b1a9c70676f668455e329d29';
  const multichainRouter = SmartContracts[chainId].multichainRouterProvider;

  async function impersonateAddress(address: string) {
    await impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);
    return impersonatedSigner;
  }

  async function deployNeededFacetsWithInitData() {
    const [owner, connectorTokenHolder, wrongRouterSwapProvider, wrongConnectorToken, wrongMultichainRouter] =
      await ethers.getSigners();

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
      'ConnectorTokenHolderFacet',
      'ConnectorTokensFacet',
      'MultichainTokenBridgeFacet',
      'MultichainConnectorTokensFacet',
      'MultichainRoutersFacet',
      'RouterSwapProvidersFacet',
    ];
    for (const facetName of requiredFacetNames) {
      await deployFacet(facetName, cuts);
    }

    const CrossChainRouter = await ethers.getContractFactory('CrossChainRouter');
    const crossChainRouter = await CrossChainRouter.deploy(cuts, owner.address);
    await crossChainRouter.deployed();

    const multichainTokenBridgeFacet = MultichainTokenBridgeFacet__factory.connect(crossChainRouter.address, owner);

    const multichainConnectorTokensFacet = MultichainConnectorTokensFacet__factory.connect(
      crossChainRouter.address,
      owner
    );
    const multichainRoutersFacet = MultichainRoutersFacet__factory.connect(crossChainRouter.address, owner);
    const connectorTokenHolderFacet = ConnectorTokenHolderFacet__factory.connect(crossChainRouter.address, owner);
    const connectorTokensFacet = ConnectorTokensFacet__factory.connect(crossChainRouter.address, owner);
    const routerSwapProvidersFacet = RouterSwapProvidersFacet__factory.connect(crossChainRouter.address, owner);
    const libSrcCrossSwap = LibSrcCrossSwap__factory.connect(crossChainRouter.address, owner);
    const iMultichainRouter = IMultichainRouter__factory.connect(crossChainRouter.address, owner);

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

    await multichainConnectorTokensFacet.addMultichainConnectorToken(
      connectorTokens[chainId][usdcToken[chainId].address].address,
      multichainAnyUsdcMainnet
    );
    await multichainRoutersFacet.addWhitelistedMultichainRouter(multichainRouter);

    return {
      someUser,
      wrongConnectorToken,
      wrongMultichainRouter,
      wrongRouterSwapProvider,
      usdc,
      multichainTokenBridgeFacet,
      connectorTokenHolderFacet,
      libSrcCrossSwap,
      iMultichainRouter,
    };
  }

  describe('Direct Connector token(USDC) transfer', () => {
    const srcToken = connectorTokens[chainId][usdcToken[chainId].address].address;
    const destChainId = 56;
    const destToken = ETH;
    const minDestAmount = '1000000000000000';

    async function createDirectUsdcTransferTx(
      srcAmount: string,
      connectorTokenAddress: string,
      multichainRouter: string
    ) {
      const { multichainTokenBridgeFacet, someUser, usdc } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      await someUser.sendTransaction({
        to: usdc.address,
        data: usdc.interface.encodeFunctionData('approve', [multichainTokenBridgeFacet.address, MAX_UINT]),
        from: userAddress,
      });

      return multichainTokenBridgeFacet.connect(someUser).initMultichainSwap(
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
        multichainRouter,
        {
          from: userAddress,
          value: 0,
        }
      );
    }

    it('successfully give approve to CrossChainRouter', async () => {
      const { someUser, multichainTokenBridgeFacet, usdc } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      const ethBalanceBeforeSwap = await someUser.getBalance();
      const allowanceBeforeSwap = await usdc.allowance(userAddress, multichainTokenBridgeFacet.address);

      const approveCalldata = usdc.interface.encodeFunctionData('approve', [
        multichainTokenBridgeFacet.address,
        MAX_UINT,
      ]);
      await someUser.sendTransaction({
        to: usdc.address,
        data: approveCalldata,
        from: userAddress,
      });

      const ethBalanceAfterSwap = await someUser.getBalance();
      const allowanceAfterSwap = await usdc.allowance(userAddress, multichainTokenBridgeFacet.address);

      expect(ethBalanceAfterSwap.lt(ethBalanceBeforeSwap)).to.be.equal(true);
      expect(Number(allowanceAfterSwap)).to.be.greaterThan(Number(allowanceBeforeSwap));
    });

    it('successful initMultichainSwap - direct connector token(USDC) transfer and bridging on src network', async () => {
      const { someUser, usdc, connectorTokenHolderFacet, libSrcCrossSwap, iMultichainRouter } = await loadFixture(
        deployNeededFacetsWithInitData
      );

      const connectorTokenHolder = await connectorTokenHolderFacet.connectorTokenHolder(chainId);
      const userAddress = await someUser.getAddress();

      const usdcBalanceBeforeSwap = await usdc.balanceOf(userAddress);

      const usdcAmount = '100000000';
      const tx = await createDirectUsdcTransferTx(
        usdcAmount,
        connectorTokens[chainId][usdcToken[chainId].address].address,
        multichainRouter
      );
      const result = await tx.wait();

      const crossChainRouterLog = result.logs?.find(
        (log) => log.address.toLowerCase() === libSrcCrossSwap.address.toLowerCase()
      );

      const multichainRouterLog = result.logs.find(
        (log) => log.address.toLowerCase() === multichainRouter.toLowerCase()
      );
      if (crossChainRouterLog && multichainRouterLog) {
        const decodedCrossChainRouterLog = libSrcCrossSwap.interface.parseLog(crossChainRouterLog);
        const decodedMultichainRouterLog = iMultichainRouter.interface.parseLog(multichainRouterLog);

        // check if all data in CrossChainRouterEvent is correct
        expect(decodedCrossChainRouterLog.name).to.be.equal(crossChainRouterEvent);
        expect(decodedCrossChainRouterLog.args.srcToken).to.be.equal(ethers.utils.getAddress(srcToken));
        expect(decodedCrossChainRouterLog.args.srcAmount.toString()).to.be.equal(usdcAmount);
        expect(decodedCrossChainRouterLog.args.destChainId).to.be.equal(destChainId);
        expect(decodedCrossChainRouterLog.args.minDestAmount.toString()).to.be.equal(minDestAmount);
        expect(decodedCrossChainRouterLog.args.destUser).to.be.equal(someUser.address);
        expect(decodedCrossChainRouterLog.args.connectorToken).to.be.equal(
          ethers.utils.getAddress(connectorTokens[chainId][usdcToken[chainId].address].address)
        );
        expect(decodedCrossChainRouterLog.args.connectorTokenIncome.toString()).not.to.be.equal('0');
        expect(decodedCrossChainRouterLog.args.refundAddress).to.be.equal(ethers.utils.getAddress(someUser.address));
        expect(decodedCrossChainRouterLog.args.liquidityProvider).to.be.equal('multichain');

        // check if all data in MultichainRouterEvent is correct
        expect(decodedMultichainRouterLog.name).to.be.equal(multichainRouterEvent);
        expect(decodedMultichainRouterLog.args.token).to.be.equal(ethers.utils.getAddress(multichainAnyUsdcMainnet));
        expect(decodedMultichainRouterLog.args.from).to.be.equal(iMultichainRouter.address);
        expect(decodedMultichainRouterLog.args.to).to.be.equal(connectorTokenHolder);
        expect(decodedMultichainRouterLog.args.amount.toString()).to.be.equal(usdcAmount);
        expect(decodedMultichainRouterLog.args.fromChainID.toString()).to.be.equal(chainId.toString());
        expect(decodedMultichainRouterLog.args.toChainID.toString()).to.be.equal('56');
      }

      const usdcBalanceAfterSwap = await usdc.balanceOf(userAddress);

      expect(usdcBalanceBeforeSwap.sub(usdcBalanceAfterSwap).toString()).to.be.equal(usdcAmount);
    });

    it('failed initMultichainSwap - direct connector token(USDC) transfer reverted because of 0 connector token income', async () => {
      const usdcAmount = '0';
      const tx = createDirectUsdcTransferTx(
        usdcAmount,
        connectorTokens[chainId][usdcToken[chainId].address].address,
        multichainRouter
      );
      await expect(tx).to.be.revertedWith('Connector token income should be positive');
    });

    it('failed initMultichainSwap - incorrect connector token address', async () => {
      const { wrongConnectorToken } = await loadFixture(deployNeededFacetsWithInitData);
      const usdcAmount = '100000000';
      const tx = createDirectUsdcTransferTx(usdcAmount, wrongConnectorToken.address, multichainRouter);
      await expect(tx).to.be.revertedWith('Connector token is not whitelisted');
    });

    it('failed initMultichainSwap - incorrect multichain router address', async () => {
      const { wrongMultichainRouter } = await loadFixture(deployNeededFacetsWithInitData);
      const usdcAmount = '100000000';
      const tx = createDirectUsdcTransferTx(
        usdcAmount,
        connectorTokens[chainId][usdcToken[chainId].address].address,
        wrongMultichainRouter.address
      );
      await expect(tx).to.be.revertedWith('Multichain Router is not whitelisted');
    });
  });

  describe('Any token to any token', () => {
    const srcToken = DAI;
    const destChainId = 56;
    const destTokenOnSrcSwap = usdcToken[chainId].address; // USDC on polygon
    const destTokenCrossChain = usdcToken[destChainId].address;
    const minDestAmount = '10000000000';

    async function createAnySwapTx(srcAmount: string, srcSwapProvider: string, destTokenAddress?: string) {
      const { multichainTokenBridgeFacet, someUser, usdc } = await loadFixture(deployNeededFacetsWithInitData);
      const userAddress = await someUser.getAddress();

      await someUser.sendTransaction({
        to: srcToken,
        data: usdc.interface.encodeFunctionData('approve', [multichainTokenBridgeFacet.address, MAX_UINT]),
        from: userAddress,
      });

      const txParams = await generateCalldataForSwap({
        chainId,
        srcToken,
        amount: srcAmount,
        destToken: destTokenAddress ?? destTokenOnSrcSwap,
        userAddress,
      });

      return multichainTokenBridgeFacet.connect(someUser).initMultichainSwap(
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
        multichainRouter,
        {
          from: userAddress,
          value: txParams.value,
        }
      );
    }

    it('successful initMultichainSwap - any token to any token', async () => {
      const { someUser, connectorTokenHolderFacet, libSrcCrossSwap, iMultichainRouter } = await loadFixture(
        deployNeededFacetsWithInitData
      );

      const dai = new ethers.Contract(DAI, erc20abi, ethers.provider);

      const connectorTokenHolder = await connectorTokenHolderFacet.connectorTokenHolder(chainId);
      const userBalanceBeforeSwap = await someUser.getBalance();
      const userDaiBalanceBeforeSwap = await dai.balanceOf(someUser.address);

      const amount = '100000000000000000000';
      const tx = await createAnySwapTx(amount, SmartContracts[chainId].paraswapSwapProvider);
      const result = await tx.wait();

      const crossChainRouterLog = result.logs?.find(
        (log) => log.address.toLowerCase() === libSrcCrossSwap.address.toLowerCase()
      );

      const multichainRouterLog = result.logs.find(
        (log) => log.address.toLowerCase() === multichainRouter.toLowerCase()
      );
      if (crossChainRouterLog && multichainRouterLog) {
        const decodedCrossChainRouterLog = libSrcCrossSwap.interface.parseLog(crossChainRouterLog);
        const decodedMultichainRouterLog = iMultichainRouter.interface.parseLog(multichainRouterLog);

        // check if all data in CrossChainRouterEvent is correct
        expect(decodedCrossChainRouterLog.name).to.be.equal(crossChainRouterEvent);
        expect(decodedCrossChainRouterLog.args.srcToken).to.be.equal(srcToken);
        expect(decodedCrossChainRouterLog.args.srcAmount.toString()).to.be.equal(amount);
        expect(decodedCrossChainRouterLog.args.destChainId).to.be.equal(destChainId);
        expect(decodedCrossChainRouterLog.args.minDestAmount.toString()).to.be.equal(minDestAmount);
        expect(decodedCrossChainRouterLog.args.destUser).to.be.equal(someUser.address);
        expect(decodedCrossChainRouterLog.args.connectorToken).to.be.equal(
          ethers.utils.getAddress(connectorTokens[chainId][usdcToken[chainId].address].address)
        );
        expect(decodedCrossChainRouterLog.args.connectorTokenIncome.toString()).not.to.be.equal('0');
        expect(decodedCrossChainRouterLog.args.refundAddress).to.be.equal(ethers.utils.getAddress(someUser.address));
        expect(decodedCrossChainRouterLog.args.liquidityProvider).to.be.equal('multichain');

        // check if all data in MultichainRouterEvent is correct
        expect(decodedMultichainRouterLog.name).to.be.equal(multichainRouterEvent);
        expect(decodedMultichainRouterLog.args.token).to.be.equal(ethers.utils.getAddress(multichainAnyUsdcMainnet));
        expect(decodedMultichainRouterLog.args.from).to.be.equal(iMultichainRouter.address);
        expect(decodedMultichainRouterLog.args.to).to.be.equal(connectorTokenHolder);
        expect(decodedMultichainRouterLog.args.amount.toString()).to.be.equal(
          decodedCrossChainRouterLog.args.connectorTokenIncome.toString()
        );
        expect(decodedMultichainRouterLog.args.fromChainID.toString()).to.be.equal(chainId.toString());
        expect(decodedMultichainRouterLog.args.toChainID.toString()).to.be.equal('56');
        const userBalanceAfterSwap = await someUser.getBalance();
        const userDaiBalanceAfterSwap = await dai.balanceOf(someUser.address);

        expect(Number(userBalanceBeforeSwap)).to.be.greaterThan(Number(userBalanceAfterSwap));
        expect(userDaiBalanceBeforeSwap.sub(userDaiBalanceAfterSwap).toString()).to.be.equal(amount);
      }
    });

    it('failed initMultichainSwap - reverted because of 0 connector token(USDC) income in any to any case', async () => {
      const amount = '10000000000000';
      const tx = createAnySwapTx(amount, SmartContracts[chainId].paraswapSwapProvider, ETH);
      await expect(tx).to.be.revertedWith('Connector token income should be positive');
    });

    it('failed initMultichainSwap - incorrect src swap provider address', async () => {
      const { wrongRouterSwapProvider } = await loadFixture(deployNeededFacetsWithInitData);
      const amount = '100000000000000000000';
      const tx = createAnySwapTx(amount, wrongRouterSwapProvider.address);
      await expect(tx).to.be.revertedWith('Swap provider is not whitelisted');
    });
  });
});

import { analytics, getLeverageAnalyticsData } from '../../../analytics/analytics';
import { ConfirmationType, TxResult } from '@dydxprotocol/starkex-eth';
import { clientManager } from '@/common/DydxClientManager';
import createTransfer from '../../../API/leverageTransfer/createTransfer';
import { TransferOperation } from '../../../API/leverageTransfer/LeverageTransfer.interfaces';
import { Chains } from 'connection/chainConfig';

/**
 * Deposit funds and send notifications about it progress
 */
export const depositUSDC = async ({
  clientAddress,
  chainId,
  userPublicStarkKey,
  positionId,
  depositValue,
}: DepositParams) => {
  sendAnalyticsData(clientAddress, chainId);

  const txResult =
    chainId === Chains.MAINNET
      ? await sendDeposit({ clientAddress, depositValue, userPublicStarkKey, positionId })
      : await fakeDeposit();

  try {
    await createTransfer({ operation: TransferOperation.DEPOSIT, amount: Number(depositValue) });
  } catch (e) {
    console.error('createTransfer', e);
  }
  return txResult;
};

/**
 * Delay helper
 */
const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Method used to fake deposit process for ROPSTEN
 */
const fakeDeposit = async (): Promise<any> => {
  setTimeout(() => clientManager.client.private.requestTestnetTokens(), 30000);
  const confirmation = async () => {
    await delay(15000);
    return {
      transactionHash: '0xeeee',
    };
  };

  return {
    confirmation: confirmation(),
  };
};

/**
 * Send statistic data
 */
const sendAnalyticsData = (clientAddress: string, chainId: Chains) => {
  const options = {
    propsType: 'transaction',
    type: 'Leverage',
    clientAddress,
    positionToken: '',
    direction: '',
    chainId,
  };

  const analyticsData = getLeverageAnalyticsData(options);
  analytics('CE leverage_deposit_form_submit', null, null, analyticsData);
  analytics('CE leverage_deposit_wallet_confirm', null, null, analyticsData);
};

/**
 * Deposit funds and return txResult object
 */
const sendDeposit = async ({ clientAddress, depositValue, userPublicStarkKey, positionId }) => {
  let txResult: TxResult;
  try {
    txResult = await clientManager.client.eth.exchange.deposit(
      {
        starkKey: userPublicStarkKey,
        positionId: positionId,
        humanAmount: depositValue,
      },
      { from: clientAddress, confirmationType: ConfirmationType.Both }
    );
  } catch (e) {
    const { signature: registerSignature } = await clientManager.client.private.getRegistration();
    txResult = await clientManager.client.eth.exchange.registerAndDeposit(
      {
        ethAddress: clientAddress,
        starkKey: userPublicStarkKey,
        signature: registerSignature,
        positionId: positionId,
        humanAmount: depositValue,
      },
      { from: clientAddress, confirmationType: ConfirmationType.Both }
    );
  }
  return txResult;
};

interface DepositParams {
  clientAddress: string;
  chainId: Chains;
  userPublicStarkKey: string;
  positionId: string;
  depositValue: number | string;
}

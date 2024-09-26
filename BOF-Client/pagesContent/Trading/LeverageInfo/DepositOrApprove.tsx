import React, { useEffect } from 'react';
import { LeverageMarketIcon } from '@/icons/leverage/LeverageMarketIcon';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';
import { clientManager } from '@/common/DydxClientManager';
import { useWeb3React } from '@web3-react/core';
import { analytics, getTokensUnlockAnalyticsData } from '../../../analytics/analytics';
import { ConfirmationType } from '@dydxprotocol/starkex-eth';
import { BigNumber } from 'bignumber.js';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { DepositModal } from './DepositModal';
import ApproveModal from '../Widget/ApproveModal/ApproveModal';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { AllowanceStatus, setAllowance } from '@/redux/dydxDataSlice';
import { Chains } from 'connection/chainConfig';

const MAX_ALLOWANCE = new BigNumber(2).pow(256).minus(1).toNumber();
const HUMAN_MAX_ALLOWANCE = convertFromWei(MAX_ALLOWANCE, 18);

interface Props {
  setActive: (a: boolean) => void;
}

const LeverageTrade: React.FC<Props> = ({ setActive }): JSX.Element => {
  const { account: clientAddress, chainId } = useWeb3React();
  const dispatch = useDispatch();
  const allowance = useAppSelector(({ dydxData }) => dydxData.allowance);

  useEffect(() => {
    if (allowance === AllowanceStatus.InProgress) {
    }
  }, [allowance]);

  const options = {
    type: 'Leverage',
    clientAddress,
    props: '',
    chainId,
  };
  const analyticsData = getTokensUnlockAnalyticsData(options);

  const approveTokenUsage = async () => {
    analytics('CE token_unlock_prompt_confirm', null, null, analyticsData);
    dispatch(setAllowance(AllowanceStatus.InProgress));
    try {
      if (chainId === Chains.MAINNET) {
        const txResult = await clientManager.client.eth.collateralToken.setExchangeAllowance(
          { humanAmount: HUMAN_MAX_ALLOWANCE },
          { from: clientAddress, confirmationType: ConfirmationType.Confirmed }
        );
        if (txResult.transactionHash) {
          analytics('CE token_unlock_wallet_confirm', null, null, analyticsData);
        }
      }
      dispatch(setAllowance(AllowanceStatus.Allowed));
    } catch (error) {
      console.error(error);
      dispatch(setAllowance(AllowanceStatus.NotAllowed));
    }
  };

  const onApproveClick = async () => {
    if (allowance === AllowanceStatus.NotAllowed) {
      approveTokenUsage().then();
    }
  };

  return (
    <>
      {allowance === AllowanceStatus.Allowed && <DepositModal setActive={setActive} />}
      {(allowance === AllowanceStatus.NotAllowed || allowance === AllowanceStatus.InProgress) && (
        <ApproveModal
          permanentlyApprove={onApproveClick}
          tokenIcon={<LeverageMarketIcon size={60} market={BASIC_LEVERAGE_TOKEN} />}
          tokenSymbol={BASIC_LEVERAGE_TOKEN}
          isLoading={allowance === AllowanceStatus.InProgress}
        />
      )}
    </>
  );
};

export default React.memo(LeverageTrade);

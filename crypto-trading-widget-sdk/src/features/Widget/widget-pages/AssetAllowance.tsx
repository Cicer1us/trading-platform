import React, { useCallback, useContext, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { assert } from 'ts-essentials';
import { WalletCtx } from 'context/WalletContext';
import { useAppDispatch, useAppSelector } from 'redux/hooks/reduxHooks';
import { NftWidgetScreen, setNftWidgetScreen } from 'redux/nftWidgetSlice';
import { ContainedButton } from 'components/Buttons/ContainedButton';
import { useRequestApproval } from 'hooks/useRequestApproval';
import { Token } from 'data/tokens/token.interface';
import { SigningStatus, TransactionSigningStatusScreen } from '../../../components/TransactionSigningStatusScreen';
import { TransactionResponse } from '@ethersproject/providers';
import { OngoingTransactionsCtx, TransactionType } from '../../../context/OngoingTransactionsContext';
import { WidgetType } from 'redux/customisationSlice';
import { setCurrentScreen } from 'redux/appSlice';
import { WidgetScreen } from 'redux/app.interface';

const DescriptionMessage: React.FC<{ txStatus: SigningStatus; token: Token }> = ({ txStatus, token }): JSX.Element => {
  if (txStatus === SigningStatus.Confirmation) {
    return (
      <>
        {'Please confirm the transaction on your wallet to unlock '}
        <Typography variant="subtitle1" color="text.primary" component="span">
          {token.symbol}
        </Typography>
      </>
    );
  } else if (txStatus === SigningStatus.Submitted) {
    return <>{'The transaction is submitted to the blockchain and is currently being processed.'}</>;
  } else if (txStatus === SigningStatus.Rejected) {
    return <>{'The transaction was rejected.'}</>;
  }
  return (
    <>
      {'Our smart contract needs your permission in order to move'}
      <Typography variant="subtitle1" color="text.primary" component={'span'}>{` ${token.symbol} `}</Typography>
      {'on your behalf.'}
    </>
  );
};

interface AssetAllowanceProps {
  spenderToken: Token;
  spenderAmount: string;
}

export const AssetAllowance: React.FC<AssetAllowanceProps> = ({ spenderToken, spenderAmount }) => {
  const dispatch = useAppDispatch();
  const ctx = useContext(WalletCtx);
  const { pushTransaction } = useContext(OngoingTransactionsCtx);
  const [txStatus, setTxStatus] = useState(SigningStatus.Idle);
  const [lastApproveIsForMaxAmount, setLastApproveIsForMaxAmount] = useState(false);
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);
  const onDismissAction =
    widgetType === WidgetType.NFT
      ? setNftWidgetScreen(NftWidgetScreen.DEFAULT)
      : setCurrentScreen(WidgetScreen.Default);

  const options = useMemo(
    () => ({
      onMutate: () => setTxStatus(SigningStatus.Confirmation),
      onError: () => setTxStatus(SigningStatus.Rejected),
      onSuccess: (data: TransactionResponse) => {
        assert(ctx?.walletChain, 'Wallet chain is not defined');
        pushTransaction(data, ctx.walletChain, {
          transactionType: TransactionType.Approve,
          tokenAddress: spenderToken.address,
        });
        setTxStatus(SigningStatus.Submitted);
        setTimeout(() => dispatch(onDismissAction), 4000);
      },
    }),
    []
  );
  const requestApproval = useRequestApproval(options);

  const handleUnlock = useCallback((getMaximumApproval: boolean) => {
    assert(ctx?.account && ctx?.library, 'Wallet is not connected');
    setLastApproveIsForMaxAmount(getMaximumApproval);
    requestApproval.mutate({
      library: ctx.library,
      spenderAddress: ctx.account,
      spenderToken,
      amount: getMaximumApproval ? undefined : spenderAmount,
    });
  }, []);
  const approveAll = useCallback(() => handleUnlock(true), []);
  const approveThisTime = useCallback(() => handleUnlock(false), []);
  const onDismiss = useCallback(() => dispatch(onDismissAction), []);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <TransactionSigningStatusScreen
        description={<DescriptionMessage txStatus={txStatus} token={spenderToken} />}
        status={txStatus}
        token={spenderToken}
        tryAgain={lastApproveIsForMaxAmount ? approveAll : approveThisTime}
        onDismiss={onDismiss}
      />
      {txStatus === SigningStatus.Idle && (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
          <ContainedButton fullWidth onClick={approveAll} sx={{ marginBottom: 1 }}>
            {'Unlock permanently'}
          </ContainedButton>
          <ContainedButton fullWidth onClick={approveThisTime}>
            {'Unlock this time'}
          </ContainedButton>
        </Box>
      )}
    </Box>
  );
};

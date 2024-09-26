import React from 'react';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { TransactionDetails } from './TransactionDetails';
import { TokenSearch } from '../widget-pages/TokenSearch';
import { SwapTokensContent } from './SwapTokensContent';
import { WidgetScreen } from '../../../redux/app.interface';
import { AssetAllowance } from '../widget-pages/AssetAllowance';
import { ConnectWalletScreen } from 'components/ConnectWalletScreen';

export const SwapTokens: React.FC = () => {
  const currentScreen = useAppSelector(({ app }) => app.currentScreen);
  const youPay = useAppSelector(({ app }) => app.youPay);
  const youPayToken = useAppSelector(({ app: { selectedChain, tokenListMap } }) => {
    const { tokens, youPayToken: youPayTokenAddress } = tokenListMap[selectedChain];
    return tokens[youPayTokenAddress];
  });

  return (
    <>
      {(currentScreen === WidgetScreen.SearchPayToken || currentScreen === WidgetScreen.SearchReceiveToken) && (
        <TokenSearch />
      )}

      {currentScreen === WidgetScreen.Default && <SwapTokensContent />}

      {currentScreen === WidgetScreen.ConfirmTransaction && <TransactionDetails />}

      {currentScreen === WidgetScreen.UnlockAsset && (
        <AssetAllowance spenderAmount={youPay.amount} spenderToken={youPayToken} />
      )}

      {currentScreen === WidgetScreen.ConnectWallet && <ConnectWalletScreen />}
    </>
  );
};

import React, { useContext } from 'react';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { useAppSelector } from 'redux/hooks/reduxHooks';
import { NftWidgetScreen } from 'redux/nftWidgetSlice';
import { BackArrowWithTitle } from './BackArrowWithTitle';
import { BuyNftScreen } from './BuyNftScreen';
import { NftWidgetAssetAllowanceScreen } from './NftAssetAllowanceScreen';
import { NftTakerTokenSearch } from './NftTakerTokenSearch';
import assert from 'assert';
import { WalletCtx } from 'context/WalletContext';
import { ConnectWalletScreen } from 'components/ConnectWalletScreen';

interface NftWidgetScreensProps {
  order: NFTOrderFromAPI;
}

export const NftWidgetScreens: React.FC<NftWidgetScreensProps> = ({ order }) => {
  const ctx = useContext(WalletCtx);
  assert(ctx, `Wallet context wasn't initialized`);
  const nftWidgetScreen = useAppSelector(state => state.nftWidget.nftWidgetScreen);

  return (
    <>
      {nftWidgetScreen !== NftWidgetScreen.DEFAULT && <BackArrowWithTitle />}

      {nftWidgetScreen === NftWidgetScreen.DEFAULT && <BuyNftScreen order={order} ctx={ctx} />}
      {nftWidgetScreen === NftWidgetScreen.SEARCH && <NftTakerTokenSearch chain={order.chainId} />}
      {nftWidgetScreen === NftWidgetScreen.ALLOWANCE_REQUEST && <NftWidgetAssetAllowanceScreen order={order} />}
      {nftWidgetScreen === NftWidgetScreen.CONNECT_WALLET && <ConnectWalletScreen />}
    </>
  );
};

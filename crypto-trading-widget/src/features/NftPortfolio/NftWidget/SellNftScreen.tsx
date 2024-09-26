import React, { useCallback, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { WidgetScreen } from './NftWidget';
import { Clarification } from 'components/Clarification/Clarification';
import { Nft } from 'services/moralis/nft-api';
import { WalletCtx } from '../../../context/WalletContext';
import { getNftIdentifier } from '../utils/common';

import { useAppSelector } from '../../../redux/hooks/reduxHooks';
import { useTokenLists } from '../../../hooks/useTokenLists';
import { useCreateNftOrder } from '../hooks/useCreateNftOrder';
import { useNftOrdersMap } from '../../../hooks/useNftOrders';

import { Chain, chainConfigs } from '../../../utils/chains';
import Web3 from 'web3';
import { decimalsToWeiUnit } from '../../../utils/common';
import { NftBasicData } from './NftBasicData';
import dayjs, { ManipulateType } from 'dayjs';
import { CancelNftOrderModal } from '../components/CancelNftOrderModal';

import { CustomButton } from '../../../components/Buttons/CustomButton';
import { AssetInput } from 'components/AssetInput/AssetInput';
import { DurationInput } from 'components/DurationInput/DurationInput';
import { selectYouReceiveTokenAddress } from 'redux/nftWidgetSlice';

interface SellNftScreenProps {
  selectedNft: Nft;
  nftAllowanceForSelectedNft: boolean;
  allowanceIsLoading: boolean;
  allowanceIsSuccess: boolean;
  allowanceIsIdle: boolean;
  setWidgetScreen: (screen: WidgetScreen) => void;
}

const DURATION_UNITS_ARRAY = ['hours', 'days', 'months'];

export const SellNftScreen: React.FC<SellNftScreenProps> = ({
  selectedNft,
  nftAllowanceForSelectedNft,
  setWidgetScreen,
  allowanceIsLoading,
  allowanceIsSuccess,
  allowanceIsIdle,
}) => {
  const ctx = useContext(WalletCtx);

  const chain = ctx?.walletChain ?? Chain.Ethereum;

  const youReceivedTokenAddress = useAppSelector(selectYouReceiveTokenAddress);

  const { data: tokenList } = useTokenLists(chain);
  const selectedToken = tokenList?.[youReceivedTokenAddress || Object.keys(tokenList)[0]];
  const { data: nftOrdersMap } = useNftOrdersMap({
    maker: ctx?.account ?? '',
    chainId: chainConfigs[ctx?.walletChain ?? Chain.Ethereum]?.chainIdDecimal ?? 0,
  });
  const order = nftOrdersMap?.[getNftIdentifier(selectedNft.token_address, selectedNft.token_id)];
  const takerToken = tokenList?.[order?.takerAsset ?? ''];

  const [durationAmount, setDurationAmount] = useState<string>('');
  const [durationUnits, setDurationUnits] = useState<ManipulateType>('days');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [modalIsOpened, setModalIsOpened] = useState(false);

  const isAmountError = receiveAmount !== '' && !Number(receiveAmount);
  const isDurationError = durationAmount !== '' && !Number(durationAmount);

  const youReceiveAmountOnChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const amount = event.target.value.replaceAll(',', '');
    setReceiveAmount(amount);
  };

  const { mutate: createOrderMutate, isLoading: createOrderIsLoading } = useCreateNftOrder(selectedNft, {
    durationAmount,
    durationUnits,
    receiveAmount,
    selectedToken,
  });

  const handleModalClose = useCallback(() => {
    setModalIsOpened(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setModalIsOpened(true);
  }, []);

  return (
    <Box display="flex" flexDirection={'column'} minHeight={'100%'}>
      <NftBasicData nft={selectedNft} order={order} />

      {!order ? (
        <>
          <Clarification
            style={{ marginBottom: '8px' }}
            title={'You Receive'}
            variant={'subtitle2'}
            description={'Amount of token you will receive'}
          />
          <AssetInput
            token={selectedToken}
            amount={receiveAmount}
            loading={false}
            error={isAmountError ? { message: 'Invalid amount', severity: 'error' } : undefined}
            search
            onChange={youReceiveAmountOnChange}
            onTokenSelectClick={() => setWidgetScreen(WidgetScreen.Search)}
          />

          <Clarification
            style={{ marginBottom: '8px' }}
            title={'Duration'}
            variant={'subtitle2'}
            description={'The amount of time for which the NFT listing will be available.'}
          />

          <DurationInput
            amount={durationAmount}
            selectedUnit={durationUnits}
            unitsArray={DURATION_UNITS_ARRAY}
            onAmountChange={setDurationAmount}
            onUnitsChange={setDurationUnits}
            error={isDurationError ? { message: 'Invalid duration', severity: 'error' } : undefined}
          />
        </>
      ) : (
        <Grid container marginTop={2} marginBottom={3}>
          <Grid item xs={6}>
            <Typography variant={'subtitle2'} marginBottom={2}>
              {'You pay'}
            </Typography>
            {takerToken && (
              <Typography variant={'subtitle2'}>{`${Web3.utils.fromWei(
                order.takerAmount,
                decimalsToWeiUnit[takerToken.decimals]
              )} ${takerToken.symbol}`}</Typography>
            )}
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant={'subtitle2'} marginBottom={2}>
              {'Expiry'}
            </Typography>
            <Typography variant={'subtitle2'}>{dayjs().to(order.expiry * 1000, true)}</Typography>
          </Grid>
        </Grid>
      )}

      <div style={{ flexGrow: 1 }} />

      {!order ? (
        <>
          <CustomButton
            onClick={() => (nftAllowanceForSelectedNft ? createOrderMutate() : setWidgetScreen(WidgetScreen.Unlock))}
            isLoading={nftAllowanceForSelectedNft ? createOrderIsLoading : allowanceIsLoading}
            disabled={
              (!!nftAllowanceForSelectedNft && (!Number(durationAmount) || !Number(receiveAmount))) ||
              (!allowanceIsIdle && !allowanceIsSuccess)
            }
          >
            {nftAllowanceForSelectedNft ? 'Sell' : 'Unlock'}
          </CustomButton>
        </>
      ) : (
        <CustomButton variant={'redButton'} onClick={handleModalOpen}>
          {'Cancel'}
        </CustomButton>
      )}

      {order && (
        <CancelNftOrderModal open={modalIsOpened} handleClose={handleModalClose} nft={selectedNft} order={order} />
      )}
    </Box>
  );
};

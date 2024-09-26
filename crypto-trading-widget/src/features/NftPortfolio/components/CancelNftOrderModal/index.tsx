import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Nft } from '../../../../services/moralis/nft-api';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { WalletCtx } from '../../../../context/WalletContext';
import { Chain } from '../../../../utils/chains';
import { useTokenLists } from '../../../../hooks/useTokenLists';
import Web3 from 'web3';
import { decimalsToWeiUnit } from '../../../../utils/common';
import { Clarification } from '../../../../components/Clarification/Clarification';
import { useNftNormalizedMetadata } from '../../hooks/useNftNormalizedMetadata';
import NftPicture from 'components/NftPicture';
import { CustomDescriptionAccordion } from '../CustomDescriptionAccordion';
import { useCancelNftOrder } from '../../hooks/useCancelNftOrder';
import { SModal, SCard, SPaper, SDescriptionTypography, STakerTokenTypography, SCircularProgress } from './styled';

interface CloseModalProps {
  nft?: Nft;
  open: boolean;
  handleClose: (event: Record<string, unknown>, reason: string) => void;
  order: NFTOrderFromAPI;
}

export const CancelNftOrderModal: React.FC<CloseModalProps> = ({ open, handleClose, nft, order }) => {
  const ctx = useContext(WalletCtx);
  const chain = ctx?.walletChain ?? Chain.Ethereum;
  const { data: tokenList } = useTokenLists(chain);
  const { data: metadata } = useNftNormalizedMetadata(nft);
  const { mutate, isLoading } = useCancelNftOrder(order);
  const takerToken = tokenList?.[order.takerAsset];

  const onClose = (event: Record<string, unknown>, reason: string) => {
    if (!isLoading) handleClose(event, reason);
  };

  return (
    <SModal open={open} onClose={onClose}>
      <SCard>
        <Typography variant={'h5'} fontWeight={700} mb={3}>{`Are you sure to cancel NFT ${metadata?.name}`}</Typography>
        <SPaper>
          <NftPicture url={metadata?.imageUrl || metadata?.animationUrl} width={145} height={100} />
          <Box overflow={'auto'}>
            <SDescriptionTypography variant={'body1'}>
              {metadata?.description && metadata?.description.length > 45 ? (
                <CustomDescriptionAccordion description={metadata?.description} />
              ) : (
                metadata?.description
              )}
            </SDescriptionTypography>
            {takerToken && (
              <STakerTokenTypography>
                {`${Web3.utils.fromWei(order.takerAmount, decimalsToWeiUnit[takerToken.decimals])} ${
                  takerToken.symbol
                }`}
                <Clarification
                  title={''}
                  variant={'subtitle2'}
                  description={'The price at which the NFT was listed.'}
                />
              </STakerTokenTypography>
            )}
          </Box>
        </SPaper>
        <Box display={'flex'} marginTop={4} gap={1}>
          <Button
            variant={'redButton'}
            fullWidth={true}
            onClick={() => mutate()}
            disabled={isLoading}
            startIcon={isLoading && <SCircularProgress size={32} />}
          >
            {'Yes, cancel'}
          </Button>
          <Button variant={'contained'} fullWidth={true} onClick={() => handleClose({}, '')} disabled={isLoading}>
            {'No, keep it'}
          </Button>
        </Box>
      </SCard>
    </SModal>
  );
};

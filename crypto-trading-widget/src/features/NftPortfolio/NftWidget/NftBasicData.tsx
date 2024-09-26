import React from 'react';
import { getShortedAddress } from '../utils/common';
import { Nft } from '../../../services/moralis/nft-api';
import { useNftNormalizedMetadata } from '../hooks/useNftNormalizedMetadata';
import NftPicture from 'components/NftPicture';
import { CustomDescriptionAccordion } from '../components/CustomDescriptionAccordion';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { InfoField } from './InfoField';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface NftBasicDataProps {
  nft: Nft;
  order?: NFTOrderFromAPI;
}

const SPictureWrapper = styled('div')({
  float: 'left',
  marginRight: 16,
});

export const NftBasicData: React.FC<NftBasicDataProps> = ({ nft, order }) => {
  const { data: metadata } = useNftNormalizedMetadata(nft);

  return (
    <>
      <Box sx={{ marginBottom: 1.5, minHeight: '100px', overflow: 'auto' }}>
        <SPictureWrapper>
          <NftPicture url={metadata?.imageUrl || metadata?.animationUrl} width={145} height={100} />
        </SPictureWrapper>
        <Box>
          <Typography gutterBottom variant="h6" component="div">
            {metadata?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
            {metadata?.description && metadata?.description.length > 45 ? (
              <CustomDescriptionAccordion description={metadata?.description} />
            ) : (
              metadata?.description
            )}
          </Typography>
        </Box>
      </Box>
      <InfoField label={'Standard '} value={nft.contract_type} />
      <InfoField label={'Address '} value={getShortedAddress(nft.token_address)} />
      <InfoField label={'Id '} value={getShortedAddress(nft.token_id)} />
      <InfoField label={'Amount '} value={nft.amount} />
      {order && <InfoField label={'Listing ID '} value={order.orderHash} copy />}
    </>
  );
};

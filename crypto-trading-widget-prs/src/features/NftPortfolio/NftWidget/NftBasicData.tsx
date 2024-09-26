import { Nft } from '../../../services/moralis/nft-api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { getShortedAddress } from '../utils/common';
import { useNftNormalizedMetadata } from '../hooks/useNftNormalizedMetadata';
import { NftPicture } from 'components/NftPicture';
import { CustomDescriptionAccordion } from '../components/CustomDescriptionAccordion';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { CopyContentButton } from '../components/CopyContentButton';

interface NftBasicDataProps {
  nft: Nft;
  order?: NFTOrderFromAPI;
}

const InfoField: React.FC<{ label: string; value: string; copy?: boolean }> = ({ label, value, copy }) => {
  return (
    <Box display={'flex'} justifyContent={'space-between'} marginBottom={1.5}>
      <Typography variant="body2" color="text.secondary">
        {label}{' '}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2">{getShortedAddress(value)}</Typography>
        {copy && (
          <CopyContentButton content={value} sx={{ height: 'max-content', minWidth: 'max-content', p: 0, ml: 0.75 }} />
        )}
      </Box>
    </Box>
  );
};

export const NftBasicData: React.FC<NftBasicDataProps> = ({ nft, order }) => {
  const { data: metadata } = useNftNormalizedMetadata(nft);

  return (
    <>
      <Box sx={{ marginBottom: 1.5, minHeight: '100px', overflow: 'auto' }}>
        <NftPicture
          url={metadata?.imageUrl || metadata?.animationUrl}
          alt={metadata?.name}
          sx={{
            width: '145px',
            height: 100,
            marginRight: 1.5,
            float: 'left',
            borderRadius: 1,
            objectFit: 'cover',
          }}
        />
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

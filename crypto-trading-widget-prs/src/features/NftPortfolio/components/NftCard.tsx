import React, { useContext } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Nft } from '../../../services/moralis/nft-api';
import { Box, Skeleton, SxProps, Theme } from '@mui/material';
import { useNftOrdersMap } from '../../../hooks/useNftOrders';
import { WalletCtx } from '../../../context/WalletContext';
import { Chain, chainConfigs } from '../../../utils/chains';
import { getNftIdentifier } from '../utils/common';
import { useTokenLists } from '../../../hooks/useTokenLists';
import Web3 from 'web3';
import { decimalsToWeiUnit } from '../../../utils/common';
import { Clarification } from '../../../components/Clarification/Clarification';
import { useNftNormalizedMetadata } from '../hooks/useNftNormalizedMetadata';
import { NftPicture } from 'components/NftPicture';

interface NftCardProps {
  nft: Nft;
  selected: boolean;
  onClick: (selected: Nft) => void;
}

export const NftCard: React.FC<NftCardProps> = ({ nft, selected, onClick }) => {
  const { data: metadata, isLoading } = useNftNormalizedMetadata(nft);
  const ctx = useContext(WalletCtx);
  const chainConfig = ctx?.walletChain ? chainConfigs[ctx.walletChain] : null;
  const { data: nftOrdersMap } = useNftOrdersMap({
    maker: ctx?.account ?? '',
    chainId: chainConfig?.chainIdDecimal ?? 0,
  });
  // If order is not found, it means that the NFT is not listed for sale
  const order = nftOrdersMap?.[getNftIdentifier(nft.token_address, nft.token_id)];
  const { data: tokenList } = useTokenLists(ctx?.walletChain ?? Chain.Ethereum);
  const takerToken = tokenList?.[order?.takerAsset ?? ''];

  const styles = (): SxProps<Theme> => {
    if (selected) {
      return {
        backgroundColor: theme => theme.palette.common.black,
      };
    } else {
      return { boxShadow: 'none' };
    }
  };

  return (
    <>
      {isLoading ? (
        <Card sx={{ display: 'flex', gap: 2, padding: 1 }}>
          <Skeleton width={145} height={100} variant="rounded" />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: 300 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: 200 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: 200 }} />
          </Box>
        </Card>
      ) : (
        <Card
          sx={{
            cursor: 'pointer',
            display: 'flex',
            gap: 2,
            padding: 1,
            borderRadius: 2,
            height: 120,
            ...styles(),
            '&:hover': {
              backgroundColor: theme => theme.palette.common.black,
              transition: 'background-color 0.2s ease-in-out',
            },
          }}
          onClick={() => onClick(nft)}
        >
          <NftPicture
            url={metadata?.imageUrl || metadata?.animationUrl}
            alt={metadata?.name}
            sx={{ display: 'flex', flexShrink: 0, objectFit: 'cover', borderRadius: 1, width: 160, height: 100 }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography gutterBottom variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
              {metadata?.name}
            </Typography>
            {order && takerToken ? (
              <Box sx={{ color: 'primary.main', display: 'flex', overflow: 'hidden' }}>
                {`${Web3.utils.fromWei(order.takerAmount, decimalsToWeiUnit[takerToken.decimals])} ${
                  takerToken.symbol
                }`}
                <Clarification
                  title={''}
                  variant={'subtitle2'}
                  description={'The price at which the NFT was listed.'}
                />
              </Box>
            ) : (
              <> </>
            )}
          </Box>
        </Card>
      )}
    </>
  );
};

import React from 'react';
import { Grid, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GridCard from 'components/Cards/GridCard';
import { CUSTOMISATION, WIDGET_DOCS } from 'urls';
import { MOBILE_BREAKPOINT_KEY } from '../../constants';
import { useBreakpoints } from '../../utils/hooks/useBreakpoints';

const buyTokenBlockHeight = 475;
const nftBlockHeight = 425;
const fiveNetworksBlockHeight = 230;
const directlyBlockHeight = fiveNetworksBlockHeight + nftBlockHeight - buyTokenBlockHeight;

export const CustomGrid: React.FC = () => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: 10 }}>
        <Grid container item xs={12} sm={12} md={8} lg={8} gap={2} sx={{ display: 'flex', height: 'inherit' }}>
          {/* buttons block */}
          <Grid
            item
            xs={12}
            sx={{
              height: directlyBlockHeight,
              width: '100%',
              [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                marginBottom: 5,
              },
            }}
          >
            <Typography
              variant="body1"
              color={theme.palette.text.secondary}
              sx={{
                padding: '0 0 48px',
                [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                  fontSize: '14px',
                  padding: '0 0 40px',
                },
              }}
            >
              {'Buy & sell crypto assets directly on your website.'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                  flexDirection: 'column',
                },
              }}
            >
              <Button
                target="_blank"
                rel="noopener noreferrer"
                href={CUSTOMISATION}
                variant="contained"
                fullWidth={isMobile}
                sx={{ minWidth: 219 }}
              >
                {'Setup widget'}
              </Button>
              <Button
                target="_blank"
                rel="noopener noreferrer"
                fullWidth={isMobile}
                href={WIDGET_DOCS}
                variant="contained"
                sx={{
                  minWidth: 219,
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': { backgroundColor: theme.palette.action.disabledBackground },
                }}
              >
                {'Docs'}
              </Button>
            </Box>
          </Grid>

          {/* Custom design block */}
          <Grid container item lg={12} spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <GridCard
                sx={{
                  height: buyTokenBlockHeight,
                  backgroundColor: theme.palette.secondary.main,
                  backgroundImage: 'url(/images/gridImages/settings.png), url(/images/gradients/customDesign.svg)',
                  backgroundRepeat: 'no-repeat, no-repeat',
                  backgroundSize: '80%, cover',
                  backgroundPositionX: 'right, right',
                  backgroundPositionY: 'bottom, center',
                  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                    height: '188px',
                    backgroundImage: 'url(/images/gradients/customDesign.svg)',
                    backgroundSize: 'cover',
                  },
                }}
                title={'Customizable design'}
                content={'Adjust the widget to your brand colors, choose what networks to work with.'}
              />
            </Grid>

            {/* Buy with token block */}
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <GridCard
                sx={{
                  height: buyTokenBlockHeight,
                  backgroundColor: theme.palette.secondary.main,
                  backgroundImage: 'url(/images/gridImages/tokens.png), url(/images/gradients/nft.svg)',
                  backgroundRepeat: 'no-repeat, no-repeat',
                  backgroundSize: '80%, cover',
                  backgroundPositionX: 'center, left',
                  backgroundPositionY: '12em, center',

                  [theme.breakpoints.down('lg')]: {
                    backgroundPositionY: '16em, center',
                  },
                  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                    height: '188px',
                    backgroundImage: 'url(/images/gradients/nft.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  },
                }}
                title={'Buy with any token'}
                content={
                  'The widget allows users to connect their wallet and buy crypto assets with any available token on their balance.'
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* NFT block */}
        <Grid container item xs={12} sm={12} md={4} lg={4} spacing={2}>
          <Grid item xs={12}>
            <GridCard
              sx={{
                height: nftBlockHeight,
                backgroundColor: theme.palette.secondary.main,
                backgroundImage: 'url(/images/gridImages/nft.png), url(/images/gradients/nft.svg)',
                backgroundRepeat: 'no-repeat, no-repeat',
                backgroundSize: '80%, cover',
                backgroundPositionX: 'center, center',
                backgroundPositionY: '12em, center',

                [theme.breakpoints.down('md')]: {
                  height: '400px',
                  backgroundPositionY: '8em, center',
                },
                [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                  height: '188px',
                  backgroundImage: 'url(/images/gradients/nft.svg)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                },
              }}
              title={'NFT'}
              content={'List NFTs and allow your users buy it without leaving your website.'}
            />
          </Grid>

          {/* 5 networks block */}
          <Grid item xs={12}>
            <GridCard
              sx={{
                backgroundColor: theme.palette.secondary.main,
                height: fiveNetworksBlockHeight,
                backgroundImage: 'url(/images/gradients/networks.svg)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',

                [theme.breakpoints.down('sm')]: {
                  height: '188px',
                },
              }}
              title={'5 networks'}
              content={'Ethereum, Polygon, Fantom, Avalanche, BSC are available for the widget users.'}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

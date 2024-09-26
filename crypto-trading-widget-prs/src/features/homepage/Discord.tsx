import React from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DISCORD } from 'urls';
import { MOBILE_BREAKPOINT_KEY } from '../../constants';
import ButtonBase from '@mui/material/ButtonBase';
import { DiscordIconSecondary } from 'components/Icons/SocialMedia/DiscordIconSecondary';

export const Discord: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          marginTop: '180px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          backgroundColor: theme.palette.background.paper,
          padding: '64px',
          paddingTop: '90px',
          paddingBottom: '90px',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          gap: '110px',
          justifyContent: 'center',
          alignContent: 'center',

          [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
            flexDirection: 'column',
            gap: '24px',
            padding: '32px',
          },
        }}
      >
        <Typography
          fontSize={40}
          fontWeight={700}
          lineHeight={1.3}
          sx={{
            textAlign: 'center',
            [theme.breakpoints.down('md')]: {
              fontSize: '32px',
            },
            [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
              textAlign: 'center',
              fontSize: '24px',
            },
          }}
        >
          Get more involved with <br /> our members in Discord
        </Typography>
        <Box sx={{ alignSelf: 'center' }}>
          <ButtonBase
            target="_blank"
            rel="noopener noreferrer"
            href={DISCORD}
            sx={{ '&:hover': { transform: 'scale(0.9)' } }}
          >
            <DiscordIconSecondary />
          </ButtonBase>
        </Box>
      </Box>
    </>
  );
};

import * as React from 'react';
import Paper from '@mui/material/Paper';
import theme from 'theme/theme';
import { BLOG, DISCORD, HELP, LINKEDIN, TELEGRAM, TERMS, TWITTER, YOUTUBE } from 'urls';
import ButtonBase from '@mui/material/ButtonBase';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { MOBILE_BREAKPOINT_KEY } from '../../constants';
import { YouTubeIcon } from 'components/Icons/SocialMedia/YouTubeIcon';
import { TelegramIcon } from 'components/Icons/SocialMedia/TelegramIcon';
import { TwitterIcon } from 'components/Icons/SocialMedia/TwitterIcon';
import { DiscordIcon } from 'components/Icons/SocialMedia/DiscordIcon';
import { LinkedInIcon } from 'components/Icons/SocialMedia/LinkedInIcon';

export const Footer: React.FC = () => {
  return (
    <Paper
      sx={{
        padding: '24px 80px 24px 80px',
        borderTop: '1px solid #3E3D4C',
        [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
          padding: 3,
        },
      }}
      component="footer"
      square
    >
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            columnGap: '24px',
            [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
              justifyContent: 'center',
            },
          }}
        >
          <Typography
            component={'a'}
            target="_blank"
            rel="noopener noreferrer"
            href={BLOG}
            color={theme.palette.text.secondary}
            sx={{
              fontSize: '14px',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                fontSize: '12px',
              },
            }}
          >
            Blog
          </Typography>

          <Typography
            component={'a'}
            target="_blank"
            rel="noopener noreferrer"
            href={TERMS}
            color={theme.palette.text.secondary}
            sx={{
              fontSize: '14px',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                fontSize: '12px',
              },
            }}
          >
            Terms Of Service
          </Typography>

          <Typography
            component={'a'}
            target="_blank"
            rel="noopener noreferrer"
            href={HELP}
            color={theme.palette.text.secondary}
            sx={{
              fontSize: '14px',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                fontSize: '14px',
              },
            }}
          >
            Help Center
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '24px',
            [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
              justifyContent: 'center',
            },
          }}
        >
          <ButtonBase target="_blank" rel="noopener noreferrer" href={TELEGRAM}>
            <TelegramIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={LINKEDIN}>
            <LinkedInIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={TWITTER}>
            <TwitterIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={DISCORD}>
            <DiscordIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={YOUTUBE}>
            <YouTubeIcon />
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
};

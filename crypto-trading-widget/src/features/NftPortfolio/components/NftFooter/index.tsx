import * as React from 'react';
import Image from 'next/image';
import { Link, ButtonBase } from '@mui/material';
import { TelegramIcon } from 'components/Icons/SocialMedia/TelegramIcon';
import { TwitterIcon } from 'components/Icons/SocialMedia/TwitterIcon';
import { DiscordIcon } from 'components/Icons/SocialMedia/DiscordIcon';
import { LinkedInIcon } from 'components/Icons/SocialMedia/LinkedInIcon';
import { YouTubeIcon } from 'components/Icons/SocialMedia/YouTubeIcon';
import { ALL_PAY, BITOFTRADE, BLOG, DISCORD, HELP, LINKEDIN, TELEGRAM, TWITTER, YOUTUBE } from 'urls';
import { SPaper, SContainer, SWrapper, SLink } from './styles';

const LOGO_PATH = '/images/logo/smallLogo.png';

export const NftFooter: React.FC = () => {
  return (
    <SPaper>
      <SContainer maxWidth="xl">
        <SWrapper>
          <Link target="_blank" rel="noopener noreferrer" href={BITOFTRADE} display={'flex'}>
            <Image loader={({ src }) => src} src={LOGO_PATH} alt={'logo'} width={28} height={20} unoptimized />
          </Link>

          <SLink target="_blank" rel="noopener noreferrer" href={BLOG}>
            {'Blog'}
          </SLink>

          <SLink target="_blank" rel="noopener noreferrer" href={ALL_PAY}>
            {'Request a Feature'}
          </SLink>

          <SLink target="_blank" rel="noopener noreferrer" href={HELP}>
            {'Contact Us'}
          </SLink>
        </SWrapper>

        <SWrapper>
          <ButtonBase target="_blank" rel="noopener noreferrer" href={TELEGRAM}>
            <TelegramIcon />
          </ButtonBase>
          <ButtonBase target="_blank" rel="noopener noreferrer" href={DISCORD}>
            <DiscordIcon />
          </ButtonBase>
          <ButtonBase target="_blank" rel="noopener noreferrer" href={LINKEDIN}>
            <LinkedInIcon />
          </ButtonBase>
          <ButtonBase target="_blank" rel="noopener noreferrer" href={TWITTER}>
            <TwitterIcon />
          </ButtonBase>
          <ButtonBase target="_blank" rel="noopener noreferrer" href={YOUTUBE}>
            <YouTubeIcon />
          </ButtonBase>
        </SWrapper>
      </SContainer>
    </SPaper>
  );
};

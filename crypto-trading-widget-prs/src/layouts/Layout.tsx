import React from 'react';
import { Footer } from 'features/homepage/Footer';
import { Discord } from 'features/homepage/Discord';
import { AppContainer } from './AppContainer';
import { AppBarDesktop } from '../components/Navigation/Desktop/AppBarDesktop';
import { useBreakpoints } from '../utils/hooks/useBreakpoints';
import { Box, styled, useTheme } from '@mui/material';
import { APP_BAR_HEIGHT_DESKTOP, APP_BAR_HEIGHT_MOBILE, MOBILE_BREAKPOINT_KEY } from '../constants';

export interface LayoutProps {
  children: React.ReactNode;
}

const SLayoutContentWrapper = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(/images/gradients/backGradient.svg)',
  backgroundPosition: 'right',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    backgroundImage: 'none',
  },
}));
export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const { isMobile } = useBreakpoints();
  const theme = useTheme();

  return (
    <SLayoutContentWrapper>
      <AppBarDesktop />
      <AppContainer
        headerOffset={isMobile ? theme.spacing(APP_BAR_HEIGHT_MOBILE + 5) : theme.spacing(APP_BAR_HEIGHT_DESKTOP + 8)}
      >
        {children}
        <Discord />
        <Footer />
      </AppContainer>
    </SLayoutContentWrapper>
  );
};

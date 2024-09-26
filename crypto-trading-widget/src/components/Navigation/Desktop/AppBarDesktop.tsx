import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ButtonBase, styled, Button, Link } from '@mui/material';
import { LinkButton } from 'components/Buttons/LinkButton';
import { BITOFTRADE_DOCS, BLOG, CUSTOMISATION } from 'urls';
import { AppContainer } from '../../../layouts/AppContainer';
import { MobileMenu } from '../Mobile/MobileMenu';
import { MOBILE_BREAKPOINT_KEY } from '../../../constants';
import { BitoftradeLogo } from 'components/Icons/BitoftradeLogo';
import { BitoftradeSmallLogo } from 'components/Icons/BitoftradeSmallLogo';
import { ProductsMenu } from './ProductsMenu';
import { useRouter } from 'next/router';

const SAppBar = styled(AppBar, {
  name: 'SAppBar',
})(({ theme }) => ({ backgroundColor: theme.palette.background.default }));

const SToolBar = styled(Toolbar, {
  name: 'AppBarDesktop',
})({
  height: 'inherit',
  display: 'flex',
  justifyContent: 'space-between',
});

const SAppBarBigLogoWrapper = styled(Box, {
  name: 'SAppBarBigLogoWrapper',
})(({ theme }) => ({
  display: 'block',
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    display: 'none',
  },
}));

const SAppBarSmallLogoWrapper = styled(Box, {
  name: 'SAppBarSmallLogoWrapper',
})(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    display: 'flex',
  },
}));

const SAppBarButton = styled(Button, {
  name: 'SAppBarButton',
})(({ theme }) => ({
  height: 40,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    height: 32,
  },
}));

const SAppBarButtonLink = styled(Link, {
  name: 'SAppBarButtonLink',
})(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

const SLinkWrapper = styled(Box, {
  name: 'SMenuWrapper',
})(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const AppBarDesktop = () => {
  const { pathname } = useRouter();

  return (
    <SAppBar>
      <AppContainer height={'inherit'}>
        <SToolBar disableGutters>
          <ButtonBase component="a" href="/">
            <SAppBarBigLogoWrapper>
              <BitoftradeLogo />
            </SAppBarBigLogoWrapper>

            <SAppBarSmallLogoWrapper>
              <BitoftradeSmallLogo />
            </SAppBarSmallLogoWrapper>
          </ButtonBase>

          <Box display={'flex'} gap={1}>
            <SLinkWrapper>
              <ProductsMenu />
              <LinkButton url={BLOG} name="Blog" />
              <LinkButton url={BITOFTRADE_DOCS} name="Docs" />
            </SLinkWrapper>

            {pathname !== CUSTOMISATION && (
              <SAppBarButton variant="contained">
                <SAppBarButtonLink href={CUSTOMISATION} target="_blank">
                  {'Setup widget'}
                </SAppBarButtonLink>
              </SAppBarButton>
            )}

            <MobileMenu />
          </Box>
        </SToolBar>
      </AppContainer>
    </SAppBar>
  );
};

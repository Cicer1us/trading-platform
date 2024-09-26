import { AppBar, Toolbar, Box, styled, Button } from '@mui/material';

export const SAppBar = styled(AppBar, {
  name: 'SAppBar',
})(({ theme }) => ({
  background: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.secondary.main}`,
}));

export const SToolbar = styled(Toolbar, {
  name: 'SToolbar',
})({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const SBigLogo = styled(Box, {
  name: 'SBigLogo',
})(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
export const SSmallLogo = styled(Box, {
  name: 'SSmallLogo',
})(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
  },
}));

export const SButton = styled(Button, {
  name: 'SButton',
})(({ theme }) => ({
  textTransform: 'none',
  height: 40,
  [theme.breakpoints.down('sm')]: {
    maxHeight: 32,
    fontSize: 14,
  },
}));

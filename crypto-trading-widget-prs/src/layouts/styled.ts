import { Box, Container, styled } from '@mui/material';

export const SWrapper = styled(Box, {
  name: 'SWrapper',
})(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: 'url(/images/gradients/backGradient.svg)',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '75%',
  [theme.breakpoints.down('md')]: {
    backgroundSize: '150%',
  },
  [theme.breakpoints.down('sm')]: {
    backgroundSize: '200%',
  },
}));

export const SLayoutContentWrapper = styled(Container, {
  name: 'SLayoutContentWrapper',
})(({ theme }) => ({
  marginTop: theme.spacing(2),
  height: '100%',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

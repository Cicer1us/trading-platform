import { Box, styled } from '@mui/material';

export const StyledContainer = styled(Box, {
  name: 'StyledContainer',
})(({ theme }) => ({
  maxWidth: theme.breakpoints.values.xl,
  width: '100%',
  margin: '0 auto',
}));

export const SModalInnerBox = styled(Box)(() => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  position: 'absolute',
  width: '100%',
}));

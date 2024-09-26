import { Box, Button, styled } from '@mui/material';

export const StyledConnectWalletButton = styled(Button, {
  name: 'StyledConnectWalletButton'
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  gap: theme.spacing(4),
  width: '100%',
  height: 80,
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontSize: 14,
  textTransform: 'none'
}));

export const StyledIconWrapper = styled(Box, {
  name: 'StyledIconWrapper'
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'max-content',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.success.light
}));

export const StyledCheckIconWrapper = styled(Box, {
  name: 'StyledCheckIconWrapper'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  marginBottom: theme.spacing(6),
  borderRadius: '50%',
  color: theme.palette.error.main,
  backgroundColor: theme.palette.error.light
}));

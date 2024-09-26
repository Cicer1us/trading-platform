import { ButtonBase, styled } from '@mui/material';

export const SLogOutHeadLineButtonBase = styled(ButtonBase, {
  name: 'SLogOutHeadLineButtonBase',
})(({ theme }) => ({
  minWidth: 40,
  padding: 0,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
  '&.MuiButtonBase-root': {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export const SConnectWalletHeadlineButtonBase = styled(ButtonBase, {
  name: 'SConnectWalletHeadlineButtonBase',
})(({ theme }) => ({
  width: 'max-content',
  padding: theme.spacing(0, 6),
  height: 40,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.text.primary,
  fontWeight: 700,
}));

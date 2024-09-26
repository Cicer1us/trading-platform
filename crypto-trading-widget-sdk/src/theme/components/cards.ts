import { Components, Theme } from '@mui/material/styles';

export const cardComponents: Components<Omit<Theme, 'components'>> = {
  MuiCard: {
    styleOverrides: {
      root: { padding: '32px' },
    },
  },
};

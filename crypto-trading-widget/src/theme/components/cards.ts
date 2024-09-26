import { Components, Theme } from '@mui/material';

export const cardComponents: Components<Omit<Theme, 'components'>> = {
  MuiCard: {
    styleOverrides: {
      root: { padding: '32px', borderRadius: '24px' },
    },
    variants: [
      {
        props: { variant: 'black' },
        style: {
          padding: 16,
        },
      },
    ],
  },
};

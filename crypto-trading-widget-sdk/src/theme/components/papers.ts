import { Components, Theme } from '@mui/material/styles';

export const paperComponents: Components<Omit<Theme, 'components'>> = {
  MuiPaper: {
    variants: [
      {
        props: { variant: 'info' },
        style: ({ theme }) => ({
          padding: theme.spacing(2),
          backgroundColor: theme.palette.paperSecondaryBackground.main,
        }),
      },
      {
        props: { variant: 'tooltip' },
        style: {
          borderWidth: 1,
          borderStyle: 'solid',
        },
      },
    ],
  },
};

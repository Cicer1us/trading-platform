import { Components, Theme } from '@mui/material';

export const paperComponents: Components<Omit<Theme, 'components'>> = {
  MuiPaper: {
    variants: [
      {
        props: { variant: 'assetInput' },
        style: {
          backgroundColor: 'inputInnerButton',
        },
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

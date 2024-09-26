import { Components, Theme } from '@mui/material/styles';
import { buttonHeight, inputInnerButtonHeight } from './constants';

export const buttonComponents: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 700,
        fontSize: 16,
        textTransform: 'none',
      },
      contained: {
        height: buttonHeight,
      },
    },
    variants: [
      {
        props: { variant: 'inputInner' },
        style: {
          height: inputInnerButtonHeight,
          padding: '5.5px 8px',
          justifyContent: 'space-evenly',
        },
      },
      {
        props: { variant: 'containedSecondary' },
        style: {
          minHeight: 40,
          minWidth: 40,
        },
      },
    ],
  },
};

import { Components, Theme } from '@mui/material';
import { buttonHeight, inputInnerButtonHeight } from './constants';

export const buttonComponents = (theme: Theme): Components<Omit<Theme, 'components'>> => {
  return {
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
            fontSize: 14,
            fontWeight: 700,
          },
        },
        {
          props: { variant: 'containedSecondary' },
          style: {
            minHeight: 40,
            minWidth: 40,
          },
        },
        {
          props: { variant: 'redButton' },
          style: {
            height: '54px',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
            },
          },
        },
      ],
    },
  };
};

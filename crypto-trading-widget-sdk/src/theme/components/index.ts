import { Components, Theme } from '@mui/material/styles';
import { buttonComponents } from './buttons';
import { inputComponents } from './inputs';
import { cardComponents } from './cards';
import { paperComponents } from './papers';

const components: Components<Omit<Theme, 'components'>> = {
  ...buttonComponents,
  ...inputComponents,
  ...cardComponents,
  ...paperComponents,

  MuiTypography: {
    variants: [
      {
        props: { variant: 'h1' },
        style: {
          fontSize: 36,
          fontWeight: 700,
        },
      },
      {
        props: { variant: 'h3' },
        style: {
          fontSize: 24,
          fontWeight: 700,
        },
      },
      {
        props: { variant: 'h5' },
        style: {
          fontSize: 18,
          fontWeight: 700,
        },
      },
      {
        props: { variant: 'subtitle1' },
        style: {
          fontSize: 14,
          fontWeight: 700,
        },
      },
      {
        props: { variant: 'subtitle2' },
        style: {
          fontSize: 16,
          fontWeight: 400,
        },
      },
      {
        props: { variant: 'body1' },
        style: {
          fontSize: 14,
        },
      },
      {
        props: { variant: 'caption' },
        style: {
          fontSize: 11,
        },
      },
    ],
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: 12,
      },
    },
  },
};

export default components;

import { Components, Theme } from '@mui/material';
import { inputHeight } from './constants';

export const inputComponents: Components<Omit<Theme, 'components'>> = {
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        borderWidth: '2px',
      },
      root: {
        height: inputHeight,
        '&:hover fieldset': {
          borderWidth: '2px',
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        height: inputHeight,
      },
      input: {
        padding: 0,
      },
    },
  },
};

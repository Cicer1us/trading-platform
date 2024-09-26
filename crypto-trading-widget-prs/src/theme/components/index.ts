import { Components, Theme } from '@mui/material';
import { buttonComponents } from './buttons';
import { inputComponents } from './inputs';
import { cardComponents } from './cards';
import { paperComponents } from './papers';

const components = (theme: Theme): Components<Omit<Theme, 'components'>> => {
  return {
    ...buttonComponents(theme),
    ...inputComponents,
    ...cardComponents,
    ...paperComponents,

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(67, 71, 72, 0.5)',
        },
      },
    },
  };
};

export default components;

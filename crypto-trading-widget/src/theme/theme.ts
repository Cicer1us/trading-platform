import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import components from './components';

export const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Inter',
    subtitle1: {
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 700,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 700,
    },
    body1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: '24px',
      fontWeight: 400,
    },
    h1: {
      fontSize: 95,
      fontWeight: 700,
    },
    h4: {
      fontSize: 24,
      fontWeight: 700,
    },
    h6: {
      fontSize: 16,
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  palette,
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 834,
      lg: 1024,
      xl: 1440,
    },
  },
};

let theme = createTheme(themeOptions);

theme = createTheme(theme, { components: components(theme) });

export default theme;

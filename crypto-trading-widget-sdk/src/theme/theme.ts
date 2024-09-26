import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import components from './components';

export const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Inter',
    subtitle1: {
      fontSize: 11,
      lineHeight: '18px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  palette,
  components,
};

const theme = createTheme(themeOptions);

export default theme;

import GlobalStyles from '@mui/material/GlobalStyles';
import { palette } from './palette';

export const CustomGlobalStyles = (
  <GlobalStyles
    styles={{
      ':root': {
        '--scrollWidth': '8px',
        '--secondaryBorderColor': palette.action.disabledBackground,
      },
      '::-webkit-scrollbar': {
        width: 'var(--scrollWidth)',
        height: 'var(--scrollWidth)',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'var(--secondaryBorderColor)',
        borderRadius: '0.2em',
      },
    }}
  />
);

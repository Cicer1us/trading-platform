import { useMediaQuery, useTheme } from '@mui/material';
import { MOBILE_BREAKPOINT_KEY } from '../../constants';

export const useBreakpoints = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(MOBILE_BREAKPOINT_KEY));

  return { isMobile };
};

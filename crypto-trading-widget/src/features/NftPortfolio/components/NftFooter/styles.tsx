import { Paper, Container, Box, styled, Typography } from '@mui/material';
import { MOBILE_BREAKPOINT_KEY } from '../../../../constants';

export const SPaper = styled(Paper, {
  name: 'SPaper',
})(({ theme }) => ({
  marginTop: 'auto',
  backgroundColor: theme.palette.background.default,
  padding: '24px 0',
  borderTop: `1px solid ${theme.palette.secondary.main}`,
}));

export const SContainer = styled(Container, {
  name: 'SContainer',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
}));

export const SWrapper = styled(Box, {
  name: 'SLinksWrapper',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
}));

export const SLink = styled('a', {
  name: 'SLink',
})(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': { textDecoration: 'underline' },
  [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
    fontSize: '12px',
  },
}));

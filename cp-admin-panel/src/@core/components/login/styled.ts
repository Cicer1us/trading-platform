import { Typography, styled } from '@mui/material';

export const SChangeContentTypography = styled(Typography, {
  name: 'STypography'
})(() => ({
  textDecoration: 'underline',
  '&:hover': {
    cursor: 'pointer'
  }
}));

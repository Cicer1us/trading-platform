import { Paper, styled } from '@mui/material';

export const SPaper = styled(Paper, {
  name: 'SPaper',
})(({ theme }) => ({
  padding: '8px 24px 8px 24px',
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

import { Card, Paper, styled } from '@mui/material';

export const SCard = styled(Card, {
  name: 'SCard',
})(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  alignContent: 'center',
  cursor: `url("images/copy-cursor.png"), auto`,
}));

export const SPaper = styled(Paper, {
  name: 'SPaper',
})(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
}));

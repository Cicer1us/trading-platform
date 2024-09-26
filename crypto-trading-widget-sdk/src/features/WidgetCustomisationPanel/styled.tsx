import { Box, Card, Grid, styled } from '@mui/material';

export const SSettingCard = styled(Card, {
  name: 'SSettingCard',
})(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
}));
export const SIntegrationCard = styled(Card, {
  name: 'SIntegrationCard',
})(({ theme }) => ({
  borderRadius: theme.spacing(2),
}));

export const SInnerTabsBox = styled(Box, {
  name: 'SInnerTabsBox',
})(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderBottom: theme.spacing(1),
  width: '100%',
}));

export const STabsGridItem = styled(Grid, {
  name: 'STabsGridItem',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'flex-start',
  },
}));

import { ButtonBase, Card, styled } from '@mui/material';

export const SNftWidgetCard = styled(Card)(({ theme }) => ({
  maxWidth: 424,
  width: '100%',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: 598,
  borderRadius: theme.spacing(2),
  margin: 'auto',
  marginBottom: theme.spacing(3),
}));

export const SCloseButtonBase = styled(ButtonBase)(() => ({
  position: 'absolute',
  right: 10,
  top: 10,
  fill: 'white',
}));

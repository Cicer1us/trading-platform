import { BoxProps, CardProps, Modal } from '@mui/material';
import { Card, styled } from '@mui/material';

export const StyledModal = styled(Modal, {
  name: 'StyledModal'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4)
}));

export const StyledModalContentWrapper = styled(Card, {
  name: 'StyledModalContentWrapper',
  shouldForwardProp: prop => !['maxWidth', 'gap'].includes(prop.toString())
})<CardProps & BoxProps>(({ theme, maxWidth, gap }) => ({
  width: '100%',
  maxWidth: maxWidth ? +maxWidth : 680,
  padding: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  gap: gap ? theme.spacing(+gap) : theme.spacing(6)
}));

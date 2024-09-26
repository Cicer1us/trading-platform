import { Card, Modal, Paper, Typography, CircularProgress, styled, Box } from '@mui/material';

export const SModal = styled(Modal, {
  name: 'SModal',
})({
  border: 'none',
  borderWidth: 0,
});

export const SCard = styled(Card, {
  name: 'SCard',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute' as const,
  maxWidth: '450px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.default,
}));

export const SPaper = styled(Paper, {
  name: 'SPaper',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
}));

export const SDescriptionTypography = styled(Typography, {
  name: 'SDescriptionTypography',
})(({ theme }) => ({
  wordWrap: 'break-word',
  marginBottom: theme.spacing(1),
  fontWeight: 700,
}));

export const STakerTokenTypography = styled(Box, {
  name: 'STakerTokenTypography',
})(({ theme }) => ({
  display: 'flex',
  wordWrap: 'break-word',
  color: theme.palette.primary.main,
}));

export const SCircularProgress = styled(CircularProgress, {
  name: 'SCircularProgress',
})(({ theme }) => ({
  color: theme.palette.error.dark,
}));

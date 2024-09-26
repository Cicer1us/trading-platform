import { Alert, AlertTitle, styled } from '@mui/material';

export const SAlert = styled(Alert, {
  name: 'SAlert',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  marginTop: 0.5,
  fontSize: '14px',
}));

export const SAlertTitle = styled(AlertTitle, {
  name: 'SAlertTitle',
})({
  fontWeight: 700,
});

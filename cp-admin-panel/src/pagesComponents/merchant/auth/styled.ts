import { Typography, FormControlLabel, FormHelperText, Link, styled, Button, Box } from '@mui/material';

export const StyledAuthTitle = styled(Typography, {
  name: 'StyledAuthTitle'
})(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}));

export const StyledAuthInputErrorMessage = styled(FormHelperText, {
  name: 'StyledAuthInputErrorMessage'
})(({ theme }) => ({
  color: theme.palette.error.main
}));

export const StyledFormControlLabel = styled(FormControlLabel, {
  name: 'StyledFormControlLabel'
})(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}));

export const StyledLink = styled(Link, {
  name: 'StyledLink'
})(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

export const StyledAuthButton = styled(Button, {
  name: 'StyledAuthButton'
})(({ theme }) => ({
  height: 48,
  fontWeight: 700,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.spacing(4),
  marginBottom: theme.spacing(7),
  textTransform: 'none'
}));

export const StyledAuthInputsWrapper = styled(Box, {
  name: 'StyledAuthInputsWrapper'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4)
}));

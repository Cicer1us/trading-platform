import { Box, TextField, styled } from '@mui/material';

export const StyledSecurityContentWrapper = styled(Box, {
  name: 'StyledSecurityContentWrapper'
})(({ theme }) => ({
  padding: theme.spacing(5),
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius
}));

export const StyledApiKeyWrapper = styled(Box, {
  name: 'StyledApiKeyWrapper'
})(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}));

export const StyledAccessStatus = styled(Box, {
  name: 'StyledAccessStatus'
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 90,
  height: 24,
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.spacing(1)
}));

export const StyledUrlTextField = styled(TextField, {
  name: 'StyledUrlTextField'
})(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper
  }
}));

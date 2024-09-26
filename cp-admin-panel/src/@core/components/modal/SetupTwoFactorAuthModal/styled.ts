import { Button, TextField, TextFieldProps, styled } from '@mui/material';

export const STwoFactorAuthInput = styled(TextField, {
  name: 'STwoFactorAuthInput'
})<TextFieldProps>(() => ({
  '& .MuiOutlinedInput-root': {
    width: 52,
    height: 56
  }
}));

export const STwoFactorAuthForm = styled('form', {
  name: 'STwoFactorAuthForm'
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

export const StyledSubmitButton = styled(Button, {
  name: 'StyledSubmitButton'
})(({ theme }) => ({
  width: '100%',
  mt: theme.spacing(6),
  p: theme.spacing(6)
}));

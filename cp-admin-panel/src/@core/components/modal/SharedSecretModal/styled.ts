import { TextField, styled } from '@mui/material';

export const StyledSharedSecretModalTextField = styled(TextField, {
  name: 'StyledAddEndpointModalTextField'
})(() => ({
  '& .MuiOutlinedInput-root': {
    height: 38
  }
}));

export const StyledSharedSecretModalForm = styled('form', {
  name: 'StyledSharedSecretModalForm'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

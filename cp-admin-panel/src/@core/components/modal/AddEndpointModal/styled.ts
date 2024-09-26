import { TextField, styled } from '@mui/material';

export const StyledAddEndpointModalTextField = styled(TextField, {
  name: 'StyledAddEndpointModalTextField'
})(() => ({
  '& .MuiOutlinedInput-root': {
    height: 38
  }
}));

export const StyledAddEndpointModalForm = styled('form', {
  name: 'StyledAddEndpointModalForm'
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(2)
}));

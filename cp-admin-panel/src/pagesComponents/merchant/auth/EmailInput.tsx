import { FormControl, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { StyledAuthInputErrorMessage } from './styled';

interface EmailInputProps {
  // TODO: specify different type for both props
  control: any;
  errors: any;
}
export const EmailInput: React.FC<EmailInputProps> = ({ control, errors }) => {
  return (
    <FormControl fullWidth>
      <Controller
        name='email'
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            autoFocus
            autoComplete='email'
            label='Email'
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            error={Boolean(errors.email)}
            placeholder='admin@bitoftrade.com'
          />
        )}
      />
      {errors.email && <StyledAuthInputErrorMessage>{errors.email.message}</StyledAuthInputErrorMessage>}
    </FormControl>
  );
};

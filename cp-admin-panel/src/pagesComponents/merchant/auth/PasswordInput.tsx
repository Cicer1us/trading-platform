import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { StyledAuthInputErrorMessage } from './styled';

interface PasswordInputProps {
  // TODO: specify different type for both props
  control: any;
  errors: any;
  name: 'password' | 'confirmPassword';
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ control, errors, name }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const label = name === 'password' ? 'Password' : 'Confirm Password';

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={`auth-${name}`} error={Boolean(errors[name])}>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange, onBlur } }) => (
          <OutlinedInput
            value={value}
            onBlur={onBlur}
            label={label}
            onChange={onChange}
            id={`auth-${name}`}
            autoComplete={name}
            error={Boolean(errors[name])}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  edge='end'
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                </IconButton>
              </InputAdornment>
            }
          />
        )}
      />
      {errors[name] && <StyledAuthInputErrorMessage>{errors[name].message}</StyledAuthInputErrorMessage>}
    </FormControl>
  );
};

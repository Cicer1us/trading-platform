import { Box, Checkbox, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { MERCHANT } from 'src/common/locationPath';
import { StyledFormControlLabel, StyledAuthInputErrorMessage, StyledLink } from './styled';

const PrivacyPolicyLabel = () => (
  <>
    <Typography variant='body2' component='span'>
      {'I agree to '}
    </Typography>
    <StyledLink href={MERCHANT}>{'privacy policy & terms'}</StyledLink>
  </>
);

interface PrivacyPolicyCheckboxProps {
  control: any;
  errors: any;
}
export const PrivacyPolicyCheckbox: React.FC<PrivacyPolicyCheckboxProps> = ({ control, errors }) => {
  return (
    <Box mb={4}>
      <Controller
        name='privacyPolicy'
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <StyledFormControlLabel
            checked={value}
            value={value}
            onChange={onChange}
            control={<Checkbox />}
            label={<PrivacyPolicyLabel />}
          />
        )}
      />
      {errors.privacyPolicy && (
        <StyledAuthInputErrorMessage>{errors.privacyPolicy.message}</StyledAuthInputErrorMessage>
      )}
    </Box>
  );
};

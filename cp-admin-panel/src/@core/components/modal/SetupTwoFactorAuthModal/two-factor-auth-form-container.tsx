import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { STwoFactorAuthForm, STwoFactorAuthInput, StyledSubmitButton } from './styled';

export const TwoFactorAuthFormContainer = ({
  submitTwoFactorAuthCode,
  buttonName = 'Continue'
}: {
  submitTwoFactorAuthCode: ({ twoFactorCode }: { twoFactorCode: string }) => void;
  buttonName?: string;
}) => {
  const [otp, setOtp] = useState('');

  const onOtpChangeHandler = (otp: string) => {
    setOtp(otp);
    verifyButtonClickHandler(otp);
  };

  const verifyButtonClickHandler = (otp: string) => {
    if (otp.length === 6) {
      submitTwoFactorAuthCode({ twoFactorCode: otp });
    }
  };

  return (
    <STwoFactorAuthForm>
      <OtpInput
        containerStyle={{
          display: 'grid',
          gap: '14px',
          gridTemplateColumns: 'repeat(6, 1fr)',
          width: '100%'
        }}
        value={otp}
        onChange={onOtpChangeHandler}
        numInputs={6}
        renderInput={props => {
          const { ref, ...rest } = props;

          return <STwoFactorAuthInput inputRef={ref} {...rest} />;
        }}
      />

      <StyledSubmitButton
        onClick={() => verifyButtonClickHandler(otp)}
        type='submit'
        variant='contained'
        disabled={Boolean(otp.length !== 6)}
      >
        {buttonName}
      </StyledSubmitButton>
    </STwoFactorAuthForm>
  );
};

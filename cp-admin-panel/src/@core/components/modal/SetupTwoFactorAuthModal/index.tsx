import { useState, useContext, useLayoutEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { Box, Button, Link, Typography } from '@mui/material';
import { AuthContext } from 'src/providers/AuthProvider';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { CustomCircularProgress } from '../../custom-circular-progress';
import { TwoFactorAuthFormContainer } from './two-factor-auth-form-container';
import { otpAuthQueryKey, useMutateOtpAuthVerify, useOtpAuthGenerateCode } from 'src/hooks/useOtpAuth';
import { StyledModalContentWrapper } from '../styled';
import { useQueryClient } from '@tanstack/react-query';
import { OtpAuthGenerateRes, getUser } from 'src/api/merchant/auth';
import { assert } from 'ts-essentials';

export const SetupTwoFactorAuthModal: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { closeModal } = useModalState();
  // TODO: implement download codes functionality
  const [currentScreen, setCurrentScreen] = useState<'SETUP' | 'DOWNLOAD_CODES' | 'SUCCESS'>('SETUP');
  const { mutateAsync: verifyOtpAsync } = useMutateOtpAuthVerify();
  const queryClient = useQueryClient();

  const otpAuthGenerateRes = queryClient.getQueryData<OtpAuthGenerateRes>([otpAuthQueryKey]);

  const submitTwoFactorAuthCode = async ({ twoFactorCode }: { twoFactorCode: string }) => {
    try {
      const secret = otpAuthGenerateRes && otpAuthGenerateRes.secret;
      assert(secret, 'secret should be generated');

      const response = await verifyOtpAsync({ token: twoFactorCode, secret });
      authContext.login(response.accessToken);

      //setting updated user globally with twoFactorAuthEnabled set to true
      const user = await getUser(response.accessToken);
      authContext.setUser(user);
      setCurrentScreen('SUCCESS');
    } catch (error) {
      toast.error('Two factor code could not be set. Please try again.');
    }
  };

  return (
    <StyledModalContentWrapper maxWidth={480} gap={2}>
      {currentScreen === 'SETUP' && <SetupTwoFactorAuthContent submitTwoFactorAuthCode={submitTwoFactorAuthCode} />}
      {currentScreen === 'SUCCESS' && <SuccessTwoFactorAuthContent closeModal={closeModal} />}
    </StyledModalContentWrapper>
  );
};

export const DownloadCodesContent = () => {
  return (
    <>
      <Typography variant='h5'>{'Download backup codes'}</Typography>
    </>
  );
};

export const SuccessTwoFactorAuthContent = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <>
      <Typography variant='h5'>{'Congrats! Authenticator is working!'}</Typography>
      <Box>
        <Typography display='inline' variant='body2' mb={4}>
          {
            'You can use recovery codes as a second factor to authenticate in case you lose access to your device. We recommend saving them with a secure password manager such as '
          }
        </Typography>
        <Typography
          display={'inline'}
          variant='body2'
          href={'https://authy.com/'}
          component={Link}
          color={'primary.main'}
          target='_blank'
        >
          {'Authy.'}
        </Typography>
      </Box>

      <Button variant='contained' color='primary' type='submit' onClick={closeModal}>
        {'Done'}
      </Button>
    </>
  );
};

export const SetupTwoFactorAuthContent = ({
  submitTwoFactorAuthCode
}: {
  submitTwoFactorAuthCode: ({ twoFactorCode }: { twoFactorCode: string }) => void;
}) => {
  const { data, isLoading, isFetching } = useOtpAuthGenerateCode();

  const canvasRef = useRef(null);
  useLayoutEffect(() => {
    if (data) {
      QRCode.toCanvas(canvasRef.current, data.url, { width: 200 }, function (error) {
        if (error) console.error(error);
      });
    }
  }, [data]);

  return (
    <>
      <Typography variant='h5'>{'Setup authenticator app'}</Typography>
      <Box mb={4}>
        <Typography display={'inline'}>{'Authenicator apps and browser extensions like '}</Typography>
        <Typography
          display={'inline'}
          variant='body2'
          href={'https://authy.com/'}
          component={Link}
          color={'primary.main'}
          target='_blank'
        >
          {'Authy'}
        </Typography>
        <Typography display={'inline'} variant='body2'>
          {', '}
        </Typography>
        <Typography
          display={'inline'}
          variant='body2'
          href={'https://www.microsoft.com/en/security/mobile-authenticator-app'}
          component={Link}
          color={'primary.main'}
          target='_blank'
        >
          {'Microsoft Authenticator'}
        </Typography>
        <Typography display={'inline'} variant='body2'>
          {', etc.'}
        </Typography>
      </Box>

      <Typography variant='h6'>{'Scan the QR code'}</Typography>
      <Typography variant='body2' mb={4}>
        {'Use an authenticator app or browser extensions to scan.'}
      </Typography>

      <Box display={'flex'} justifyContent={'center'}>
        {isLoading || isFetching ? <CustomCircularProgress /> : <Box component='canvas' ref={canvasRef}></Box>}
      </Box>
      <Typography variant='h6' mb={2}>
        {'Verify the code from the app'}
      </Typography>

      <TwoFactorAuthFormContainer submitTwoFactorAuthCode={submitTwoFactorAuthCode} />
    </>
  );
};

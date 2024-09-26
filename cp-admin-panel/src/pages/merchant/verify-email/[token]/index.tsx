import { BoxProps, Typography, Card, Box, styled, Link } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AuthLayout } from 'src/@core/layouts/AuthLayout';
import { verifyEmail } from 'src/api/merchant/auth';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { MERCHANT_LOGIN } from 'src/common/locationPath';
import Icon from 'src/@core/components/icon';

enum VerifyEmailScreen {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

interface StyledIconWrapperProps extends BoxProps {
  screen?: VerifyEmailScreen;
}

const StyledIconWrapper = styled(({ ...props }: StyledIconWrapperProps) => <Box {...props} />, {
  name: 'StyledIconWrapper',
  shouldForwardProp: prop => prop !== 'screen'
})(({ theme, screen }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  color: screen === VerifyEmailScreen.SUCCESS ? theme.palette.common.white : theme.palette.error.main,
  backgroundColor: screen === VerifyEmailScreen.SUCCESS ? theme.palette.success.main : theme.palette.error.light
}));

const StyledCard = styled(Card, {
  name: 'StyledCard'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(6),
  padding: theme.spacing(12)
}));

const StyledLink = styled(Link, {
  name: 'StyledLink'
})(({ theme }) => ({
  display: 'flex',
  '& svg': { mr: 1.5 },
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}));

const VerifyEmail = () => {
  const [screen, setScreen] = useState<VerifyEmailScreen>();
  const { query } = useRouter();

  const initVerify = useCallback(async () => {
    try {
      await verifyEmail(query.token as string);
      setScreen(VerifyEmailScreen.SUCCESS);
    } catch (error: any) {
      setScreen(VerifyEmailScreen.ERROR);
      console.error('initVerify error', error);
    }
  }, [query.token]);

  useEffect(() => {
    initVerify();
  }, [initVerify, query.token]);

  return (
    <StyledCard>
      {screen === VerifyEmailScreen.SUCCESS && (
        <>
          <Typography variant='h5'>{'Verification Success'}</Typography>
          <StyledIconWrapper screen={screen}>
            <CheckIcon fontSize='large' />
          </StyledIconWrapper>
        </>
      )}
      {screen === VerifyEmailScreen.ERROR && (
        <>
          <Typography variant='h5'>{'Verification Error'}</Typography>
          <StyledIconWrapper screen={screen}>
            <ErrorOutlineIcon fontSize='large' />
          </StyledIconWrapper>
        </>
      )}
      <Typography display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <StyledLink href={MERCHANT_LOGIN}>
          <Icon icon='mdi:chevron-left' fontSize='2rem' />
          {'Back to login'}
        </StyledLink>
      </Typography>
    </StyledCard>
  );
};

VerifyEmail.guestGuard = true;
VerifyEmail.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default VerifyEmail;

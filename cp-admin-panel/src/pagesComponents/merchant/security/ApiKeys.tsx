import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { CopyContentButton } from 'src/@core/components/buttons/CopyContentButton';
import { PrimaryButton } from 'src/@core/components/buttons/PrimaryButton';
import { AuthContext } from 'src/providers/AuthProvider';
import { StyledSecurityContentWrapper, StyledApiKeyWrapper, StyledAccessStatus } from './styled';

export const ApiKeys: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <StyledSecurityContentWrapper>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={7}>
        <Typography variant='h5'>{'API Key List & Access'}</Typography>
        <PrimaryButton fullWidth disabled>
          {'Create Key'}
        </PrimaryButton>
      </Box>

      <Typography variant='body2' mb={6}>
        {`An API key is a simple encrypted string that identifies an application without any principal. They are useful
     for accessing public data anonymously, and are used to associate API requests with your project for quota and
     billing.`}
      </Typography>

      <StyledApiKeyWrapper>
        <Box display={'flex'} alignItems={'center'} gap={4} mb={2.5}>
          <Typography variant='h5'>{'Server Key 1'}</Typography>

          <StyledAccessStatus>
            <Typography variant='body2' color={'primary.contrastText'}>
              {'Full Access'}
            </Typography>
          </StyledAccessStatus>
        </Box>

        <Box display={'flex'} alignItems={'center'} gap={4} mb={2.5}>
          <Typography fontWeight={700} color={'text.secondary'}>
            {user?.apiKey}
          </Typography>

          <CopyContentButton content={user?.apiKey} />
        </Box>

        <Typography variant='body2' color={'grey.A400'}>
          {'Created on 28 Apr 2021, 18:20 GTM+4:10'}
        </Typography>
      </StyledApiKeyWrapper>
    </StyledSecurityContentWrapper>
  );
};

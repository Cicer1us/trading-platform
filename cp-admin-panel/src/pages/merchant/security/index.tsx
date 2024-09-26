import { Box } from '@mui/material';
import { ApiKeys } from 'src/pagesComponents/merchant/security/ApiKeys';
import { WalletAddress } from 'src/pagesComponents/merchant/security/WalletAddress';
import { Subscription } from 'src/pagesComponents/merchant/security/Subscription';
import { TwoFactorAuthentication } from 'src/pagesComponents/merchant/security/TwoFactorAuthentication';

const Security: React.FC = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={6}>
      <WalletAddress />
      <ApiKeys />
      <Subscription />
      <TwoFactorAuthentication />
    </Box>
  );
};

export default Security;

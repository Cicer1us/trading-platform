import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { SecondaryButton } from '../../../../components/Buttons/SecondaryButton';
import { useTheme } from '@mui/material';
import { useContext } from 'react';
import { WalletCtx, WalletCtxInterface } from '../../../../context/WalletContext';
import LogoutIcon from '@mui/icons-material/Logout';
import { SelectChain } from '../SelectChain';
import { CopyContentButton } from '../CopyContentButton';
import { getShortedAddress } from '../../utils/common';
import { SAppBar, SToolbar, SBigLogo, SSmallLogo, SButton } from './styled';
import Image from 'next/image';
import { Chain, checkChainAvailability } from 'utils/chains';

const BIG_LOGO_PATH = '/images/logo/bigLogo.png';
const SMALL_LOGO_PATH = '/images/logo/smallLogo.png';

const NtfAppBar = () => {
  const { account, walletChain, disconnect, connectWallet } = useContext(WalletCtx) as WalletCtxInterface;
  const isChainAvailable = checkChainAvailability(walletChain as Chain);
  const theme = useTheme();

  return (
    <SAppBar position="static">
      <Container maxWidth="xl">
        <SToolbar disableGutters>
          <Box>
            <SBigLogo>
              <Image loader={({ src }) => src} src={BIG_LOGO_PATH} alt={'logo'} width={128} height={20} unoptimized />
            </SBigLogo>
            <SSmallLogo>
              <Image loader={({ src }) => src} src={SMALL_LOGO_PATH} alt={'logo'} width={28} height={20} unoptimized />
            </SSmallLogo>
          </Box>
          <Box>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              {account ? (
                <>
                  {isChainAvailable && <SelectChain />}
                  <CopyContentButton
                    content={account}
                    sx={{
                      // TODO: should be refactored to use without sx prop
                      display: 'flex',
                      gap: 1,
                      height: 40,
                      fontSize: 14,
                      padding: isChainAvailable ? 0 : '0 16px',
                      backgroundColor: theme.palette.secondary.main,
                      '&:hover': {
                        borderColor: theme.palette.text.primary,
                        backgroundColor: theme.palette.primary.dark,
                      },
                      [theme.breakpoints.down('sm')]: {
                        maxWidth: 154,
                        height: 32,
                      },
                    }}
                  >
                    <>{getShortedAddress(account)}</>
                  </CopyContentButton>
                  <SecondaryButton onClick={() => disconnect()}>
                    <LogoutIcon fontSize={'small'} />
                  </SecondaryButton>
                </>
              ) : (
                <SButton variant={'contained'} onClick={connectWallet}>
                  {'Connect Wallet'}
                </SButton>
              )}
            </Box>
          </Box>
        </SToolbar>
      </Container>
    </SAppBar>
  );
};
export default NtfAppBar;

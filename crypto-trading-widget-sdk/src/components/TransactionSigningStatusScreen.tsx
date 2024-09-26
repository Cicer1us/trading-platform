import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { Token } from 'data/tokens/token.interface';
import { ReactComponent as ExclamationMarkSvg } from './Icons/exclamationMark.svg';
import { ReactComponent as SuccessSvg } from './Icons/success.svg';
import { ContainedButton } from './Buttons/ContainedButton';
import { TokenImage } from './TokenImage';

export enum SigningStatus {
  Idle = 'idle',
  Confirmation = 'confirmation',
  Submitted = 'submitted',
  Rejected = 'rejected',
}

interface TransactionSigningStatusScreenProps {
  title?: string;
  description: string | JSX.Element;
  status: SigningStatus;
  token?: Token;
  tryAgain?: () => void;
  onDismiss?: () => void;
}

const StatusIcon: React.FC<{ status: SigningStatus; token?: Token }> = ({ status, token }) => {
  const statusIcons: Record<SigningStatus, JSX.Element> = {
    [SigningStatus.Confirmation]: <CircularProgress size={60} />,
    [SigningStatus.Rejected]: <ExclamationMarkSvg />,
    [SigningStatus.Submitted]: <SuccessSvg />,
    [SigningStatus.Idle]: (
      <TokenImage
        src={token?.logoURI ?? `${process.env.REACT_APP_STORAGE}/default-token-icon.png`}
        width="60px"
        height="60px"
        style={{ marginRight: '8px' }}
        alt={''}
      />
    ),
  };
  return statusIcons[status];
};

const getTitleMessage = (txStatus: SigningStatus): string => {
  if (txStatus === SigningStatus.Confirmation) {
    return 'Waiting for confirmation';
  } else if (txStatus === SigningStatus.Submitted) {
    return 'Transaction is submitted';
  } else if (txStatus === SigningStatus.Rejected) {
    return 'Reject';
  }
  return 'Unlock token';
};

export const TransactionSigningStatusScreen: React.FC<TransactionSigningStatusScreenProps> = ({
  title,
  description,
  status,
  token,
  tryAgain,
  onDismiss,
}) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box sx={{ display: 'flex', mt: 7, mb: 2, alignItems: 'center', justifyContent: 'center' }}>
        <StatusIcon status={status} token={token} />
      </Box>

      <Typography variant="subtitle2" color={theme.palette.text.primary} align="center" fontWeight={700}>
        {title ?? getTitleMessage(status)}
      </Typography>

      <Typography variant="subtitle2" component="span" align="center" color={theme.palette.text.secondary}>
        {description}
      </Typography>

      <div style={{ flexGrow: 1 }} />
      {status === SigningStatus.Rejected && (
        <Box display="flex" gap="8px">
          <ContainedButton sx={{ width: '50%', mb: 1 }} onClick={tryAgain}>
            {'Try again'}
          </ContainedButton>

          <ContainedButton sx={{ width: '50%', mb: 1 }} onClick={onDismiss}>
            {'Dismiss'}
          </ContainedButton>
        </Box>
      )}
      {status === SigningStatus.Submitted && (
        <ContainedButton fullWidth sx={{ mb: 1 }} onClick={onDismiss}>
          {'Dismiss'}
        </ContainedButton>
      )}
    </Box>
  );
};

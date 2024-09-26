import { Box, Typography, styled } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DefaultButton } from 'src/@core/components/buttons/DefaultButton';

const StyledCheckIconWrapper = styled(Box, {
  name: 'StyledCheckIconWrapper'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  marginBottom: theme.spacing(6),
  borderRadius: '50%',
  color: theme.palette.error.main,
  backgroundColor: theme.palette.error.light
}));

interface ErrorTxContentProps {
  title: string;
  description: string;
  onDismiss?: () => void;
  onTryAgain?: () => void;
}

export const ErrorTxContent: React.FC<ErrorTxContentProps> = ({ title, description, onDismiss, onTryAgain }) => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
      <StyledCheckIconWrapper>
        <ErrorOutlineIcon />
      </StyledCheckIconWrapper>
      <Typography variant='h5' mb={4}>
        {title}
      </Typography>
      <Typography variant='body1' textAlign={'center'} mb={10} color={'text.secondary'}>
        {description}
      </Typography>
      <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={2}>
        {onTryAgain && <DefaultButton onClick={onTryAgain}>{'Try again'}</DefaultButton>}
        {onDismiss && <DefaultButton onClick={onDismiss}>{'Dismiss'}</DefaultButton>}
      </Box>
    </Box>
  );
};

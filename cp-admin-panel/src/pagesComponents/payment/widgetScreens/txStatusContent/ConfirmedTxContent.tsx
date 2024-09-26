import { Box, Typography, styled } from '@mui/material';
import { DefaultButton } from 'src/@core/components/buttons/DefaultButton';
import CheckIcon from '@mui/icons-material/Check';

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
  color: theme.palette.common.white,
  backgroundColor: theme.palette.success.main
}));

interface ConfirmedTxContentProps {
  title: string;
  description: string;
  buttonContent?: string;
  onClick?: () => void;
}

export const ConfirmedTxContent: React.FC<ConfirmedTxContentProps> = ({
  title,
  description,
  buttonContent,
  onClick
}) => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
      <StyledCheckIconWrapper>
        <CheckIcon />
      </StyledCheckIconWrapper>
      <Typography variant='h5' mb={4}>
        {title}
      </Typography>
      <Typography variant='subtitle2' textAlign={'center'} mb={10}>
        {description}
      </Typography>
      <DefaultButton onClick={onClick}>{buttonContent}</DefaultButton>
    </Box>
  );
};

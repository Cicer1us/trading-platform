import { Box, CircularProgress, styled, Typography } from '@mui/material';

const StyledLoaderShadow = styled(CircularProgress, {
  name: 'StyledLoader'
})(({ theme }) => ({
  color: theme.palette.success.light
}));

const StyledLoader = styled(CircularProgress, {
  name: 'StyledLoaderWrapper'
})(({ theme }) => ({
  position: 'absolute',
  left: 0,
  color: theme.palette.success.main
}));

interface WaitingTxContentProps {
  title: string;
  description: string;
}

export const WaitingTxContent: React.FC<WaitingTxContentProps> = ({ title, description }) => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
      <Box position='relative' mb={6}>
        <StyledLoaderShadow variant='determinate' size={60} thickness={4} value={100} />
        <StyledLoader size={60} thickness={6} />
      </Box>
      <Typography variant='h5' mb={4}>
        {title}
      </Typography>
      <Typography variant='body1' color={'text.secondary'} textAlign={'center'} maxWidth={240}>
        {description}
      </Typography>
    </Box>
  );
};

import { Box, CircularProgress, styled } from '@mui/material';

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

export const CustomCircularProgress = () => {
  return (
    <Box position='relative' mb={6}>
      <StyledLoaderShadow variant='determinate' size={60} thickness={4} value={100} />
      <StyledLoader size={60} thickness={6} />
    </Box>
  );
};

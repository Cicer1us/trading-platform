import { ReactNode } from 'react';
import { Box, styled } from '@mui/material';

const StyledAuthContainer = styled(Box, {
  name: 'StyledAuthContainer'
})(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper
}));

const StyledAuthContentWrapper = styled(Box, {
  name: 'StyledAuthContentWrapper'
})({
  maxWidth: 394,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: 1
});

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <StyledAuthContainer>
      <StyledAuthContentWrapper>{children}</StyledAuthContentWrapper>
    </StyledAuthContainer>
  );
};

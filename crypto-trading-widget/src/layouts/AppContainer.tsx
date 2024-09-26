import React from 'react';
import Container from '@mui/material/Container';
import theme from '../theme/theme';

export const AppContainer: React.FC<{
  children: React.ReactNode;
  headerOffset?: number | string;
  height?: string | number;
}> = ({ children, headerOffset, height }) => {
  return (
    <Container
      maxWidth={'xl'}
      sx={{
        paddingTop: headerOffset ?? 0,
        minWidth: 375,
        height,
        [theme.breakpoints.up('sm')]: {
          paddingLeft: 10,
          paddingRight: 10,
        },
        [theme.breakpoints.down('lg')]: {
          paddingLeft: 5,
          paddingRight: 5,
        },
        [theme.breakpoints.down('sm')]: {
          paddingLeft: 3,
          paddingRight: 3,
        },
      }}
    >
      {children}
    </Container>
  );
};

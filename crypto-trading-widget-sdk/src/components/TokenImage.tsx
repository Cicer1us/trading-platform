import React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

interface TokenImageProps {
  src: string;
  style?: React.CSSProperties;
  alt: string;
}

export const TokenImage = styled((props: BoxProps & TokenImageProps) => (
  <Box
    component="img"
    onError={({ currentTarget }: any) => {
      currentTarget.onerror = null;
      currentTarget.src = `${process.env.REACT_APP_STORAGE}/default-token-icon.png`;
    }}
    {...props}
  />
))(({ style }) => ({ ...style }));

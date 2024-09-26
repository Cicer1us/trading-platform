import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';

interface TokenImageProps {
  src: string;
  sx?: SxProps;
  alt: string;
}

export const NftImage: React.FC<TokenImageProps> = ({ src, sx, alt }) => {
  return (
    <Box
      component="img"
      src={src}
      sx={sx}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = `${process.env.REACT_APP_STORAGE}/no_image.png`;
      }}
      loading={'lazy'}
      alt={alt}
    />
  );
};

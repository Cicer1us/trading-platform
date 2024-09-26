import React, { useEffect, useState } from 'react';

import { Box, CardMedia } from '@mui/material';
import { NO_NFT_IMAGE_PATH } from '../constants';
import { handleNoImageError } from 'features/NftPortfolio/utils/errorHandlers';

interface NftPictureProps {
  url: string;
  alt: string;
  sx: React.CSSProperties;
}

type Media = 'image' | 'video';

export const NftPicture: React.FC<NftPictureProps> = ({ sx, alt, url }) => {
  const [mediaType, setMediaType] = useState<Media>('image');

  useEffect(() => {
    setMediaType('image');
  }, [url]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    try {
      setMediaType('video');
    } catch (error) {
      handleNoImageError(event, NO_NFT_IMAGE_PATH);
    }
  };

  return (
    <>
      {mediaType === 'image' && <Box component={'img'} src={url} sx={sx} onError={handleError} alt={alt} />}
      {mediaType === 'video' && <CardMedia component="video" src={url} sx={sx} autoPlay />}
    </>
  );
};

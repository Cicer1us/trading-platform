import React, { useEffect, useState } from 'react';
import { Box, CardMedia } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { NO_NFT_IMAGE_URL } from '../../../constants';

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
      const img = event.currentTarget as HTMLImageElement;
      img.onerror = null;
      img.src = NO_NFT_IMAGE_URL;
    }
  };

  if (!url) {
    return <Skeleton sx={sx} variant="rounded" />;
  }
  return (
    <>
      {mediaType === 'image' && (
        <Box component={'img'} src={url} sx={sx} onError={handleError} alt={alt} loading={'lazy'} />
      )}
      {mediaType === 'video' && <CardMedia component="video" src={url} sx={sx} autoPlay />}
    </>
  );
};

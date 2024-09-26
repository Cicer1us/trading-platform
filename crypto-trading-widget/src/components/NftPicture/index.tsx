import React, { SyntheticEvent } from 'react';
import { SImageBox } from './styled';
import { NO_NFT_IMAGE_PATH, RESIZING_SERVICE_URL } from '../../constants';
import { handleNoImageError } from 'features/NftPortfolio/utils/errorHandlers';

interface NftPictureProps {
  url: string;
  width?: number;
  height?: number;
}

const NftPicture: React.FC<NftPictureProps> = ({ width = 160, height = 100, url }) => {
  const resizedImg = `${RESIZING_SERVICE_URL}/width=200,quality=85/${url}`;
  return (
    <SImageBox
      key={resizedImg}
      component={'img'}
      src={resizedImg}
      alignSelf={'center'}
      width={width}
      height={height}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => handleNoImageError(e, NO_NFT_IMAGE_PATH)}
      alt={''}
    />
  );
};

export default React.memo(NftPicture);

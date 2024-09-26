import React from 'react';
import style from './CoinsImages.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import CoinIcons from '@/assets/icons/CoinIcons';

interface CoinsImagesProps {
  symbol: string;
  size?: string;
  uri?: string;
}

const CoinsImages: React.FC<CoinsImagesProps> = ({ uri, symbol, size = '40px' }: CoinsImagesProps): JSX.Element => {
  const logoURIs = useAppSelector(({ widget }) => widget.symbolToLogoUriMap);
  const logoURI = logoURIs[symbol] ?? uri;

  return (
    <>
      {logoURI && (
        <div className={style.wrapper} style={{ height: size, width: size, borderRadius: size, overflow: 'hidden' }}>
          <img
            width={size}
            height={size}
            src={logoURI}
            // apply default icon for broken src
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/static/default-token-icon.png';
            }}
          />
        </div>
      )}
      {!logoURI && <CoinIcons coinName={symbol} size={size} />}
    </>
  );
};

export default React.memo(CoinsImages);

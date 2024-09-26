import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from '@mui/material/styles';

import { useGetNftOrderByHash } from 'hooks/useGetNftOrderByHash';
import { SettingTab, WidgetOptions } from 'redux/customisationSlice';
import { SCloseButtonBase, SNftWidgetCard } from './styled';
import { LoadedOrderScreens } from './components/LoadedOrderScreens';
import { useNftWidgetTheme } from './hooks/useNftWidgetTheme';
import { useAppSelector } from 'redux/hooks/reduxHooks';
import { AlertsSample } from 'features/Widget/AlertsSample';

export interface WidgetNftProps {
  orderHash: string;
  widgetOptions?: WidgetOptions;
  onCloseClick?: () => void;
}

export const WidgetNft: React.FC<WidgetNftProps> = ({ orderHash, widgetOptions, onCloseClick }) => {
  const innerTheme = useNftWidgetTheme(widgetOptions);
  const { data: orderFromApi } = useGetNftOrderByHash(orderHash);
  const display = useAppSelector(({ customisation }) => customisation.currentSettingsTab);

  return (
    <>
      {innerTheme && (
        <ThemeProvider theme={innerTheme}>
          <SNftWidgetCard>
            {onCloseClick && (
              <SCloseButtonBase onClick={onCloseClick}>
                <CloseIcon />
              </SCloseButtonBase>
            )}
            {orderFromApi ? (
              <>
                {display !== SettingTab.ALERTS && <LoadedOrderScreens order={orderFromApi} />}
                {display === SettingTab.ALERTS && <AlertsSample />}
              </>
            ) : (
              <Skeleton variant="rounded" height={'100%'} />
            )}
          </SNftWidgetCard>
        </ThemeProvider>
      )}
    </>
  );
};

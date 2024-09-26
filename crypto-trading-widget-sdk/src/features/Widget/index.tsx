import React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { ThemeProvider } from '@mui/material/styles';
import { SwapTokens } from './Swap/SwapTokens';

import { SettingTab, WidgetOptions } from '../../redux/customisationSlice';

import { AlertsSample } from './AlertsSample';
import CloseIcon from '@mui/icons-material/Close';
import { WidgetContainer } from './components/WidgetContainer/WidgetContainer';
import { useWidgetTheme } from './hooks/useWidgetTheme';
import { useAppSelector } from 'redux/hooks/reduxHooks';

interface WidgetProps {
  widgetOptions?: WidgetOptions;
  onCloseClick?: () => void;
}

export const Widget: React.FC<WidgetProps> = ({ widgetOptions, onCloseClick }) => {
  const innerTheme = useWidgetTheme(widgetOptions);
  const display = useAppSelector(({ customisation }) => customisation.currentSettingsTab);

  return (
    <>
      {innerTheme && (
        <ThemeProvider theme={innerTheme}>
          <WidgetContainer>
            <>
              {onCloseClick && (
                <ButtonBase sx={{ position: 'absolute', right: 10, top: 10, fill: 'white' }} onClick={onCloseClick}>
                  <CloseIcon />
                </ButtonBase>
              )}
              {display !== SettingTab.ALERTS && <SwapTokens />}
              {display === SettingTab.ALERTS && <AlertsSample />}
            </>
          </WidgetContainer>
        </ThemeProvider>
      )}
    </>
  );
};

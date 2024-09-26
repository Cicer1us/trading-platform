import Web3 from 'web3';
import { Theme } from '@emotion/react';
import { createTheme } from '@mui/material';
import { AVAILABLE_CHAINS } from '../../../constants';
import { widgetColors, notificationColors } from 'features/WidgetCustomisationPanel/constants';
import { changeThemeOptionsColor } from 'features/WidgetCustomisationPanel/utils';
import { useState, useEffect } from 'react';
import { setYouReceiveToken, setChainList, setWidgetType } from 'redux/appSlice';
import { WidgetOptions } from 'redux/customisationSlice';
import { themeOptions } from 'theme/theme';
import { Chain } from 'utils/chains';
import { useAppDispatch, useAppSelector } from 'redux/hooks/reduxHooks';

export const useWidgetTheme = (widgetOptions?: WidgetOptions) => {
  const dispatch = useAppDispatch();
  const tokenListMap = useAppSelector(({ app }) => app.tokenListMap);
  const [innerTheme, setInnerTheme] = useState<Theme>();

  useEffect(() => {
    widgetColors.forEach(color => {
      if (widgetOptions?.paletteOverrides[color.key]) {
        changeThemeOptionsColor(themeOptions, color.key, widgetOptions?.paletteOverrides[color.key]);
      }
    });

    notificationColors.forEach(color => {
      if (widgetOptions?.paletteOverrides[color.key]) {
        changeThemeOptionsColor(themeOptions, color.key, widgetOptions?.paletteOverrides[color.key]);
      }
    });

    const newTheme = createTheme(themeOptions);
    setInnerTheme(newTheme);

    const chainList: Chain[] = [];
    AVAILABLE_CHAINS.forEach(chain => {
      const decimalChainSettings = widgetOptions?.chainOptions?.[chain];
      const hexChainSettings = widgetOptions?.chainOptions?.[Web3.utils.toHex(chain)];
      const chainSettings = decimalChainSettings ?? hexChainSettings;

      if (chainSettings?.enabled) {
        chainList.push(chain);
      }
      if (chainSettings?.defaultTokenAddress) {
        dispatch(
          setYouReceiveToken({
            chain: chain,
            token: tokenListMap[chain].tokens[chainSettings.defaultTokenAddress.toLowerCase()],
          })
        );
      }
    });
    dispatch(setChainList(chainList.length > 0 ? chainList : [Chain.Ethereum]));

    if (widgetOptions) {
      dispatch(setWidgetType(widgetOptions.widgetType));
    }
  }, [widgetOptions]);

  return innerTheme;
};

import { Theme } from '@emotion/react';
import { createTheme } from '@mui/material';
import { notificationColors, nftWidgetColors } from 'features/WidgetCustomisationPanel/constants';
import { changeThemeOptionsColor } from 'features/WidgetCustomisationPanel/utils';
import { useState, useEffect } from 'react';
import { WidgetOptions } from 'redux/customisationSlice';
import { themeOptions } from 'theme/theme';

export const useNftWidgetTheme = (widgetOptions?: WidgetOptions) => {
  const [innerTheme, setInnerTheme] = useState<Theme>();

  useEffect(() => {
    if (widgetOptions) {
      nftWidgetColors.forEach(color => {
        if (widgetOptions.paletteOverrides?.[color.key]) {
          changeThemeOptionsColor(themeOptions, color.key, widgetOptions.paletteOverrides[color.key]);
        }
      });

      notificationColors.forEach(color => {
        if (widgetOptions.paletteOverrides?.[color.key]) {
          changeThemeOptionsColor(themeOptions, color.key, widgetOptions.paletteOverrides[color.key]);
        }
      });
    }

    const newTheme = createTheme(themeOptions);
    setInnerTheme(newTheme);
  }, [widgetOptions]);

  return innerTheme;
};

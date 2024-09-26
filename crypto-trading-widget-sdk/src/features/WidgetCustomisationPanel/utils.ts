import { ThemeOptions } from '@mui/material/styles';
import { ColorKey } from './components/ColorPicker';
import { palette } from '../../theme/palette';

export const changeThemeOptionsColor = (
  themeOptions: ThemeOptions,
  color: ColorKey,
  value: string,
  cb?: (themeOptions: ThemeOptions) => void
) => {
  const pal = themeOptions.palette;

  if (!pal) {
    return;
  }

  switch (color) {
    case ColorKey.PaperBackground:
      pal.background = { ...pal.background, paper: value };
      break;
    case ColorKey.TextPrimary:
      pal.text = { ...pal.text, primary: value };
      break;
    case ColorKey.TextSecondary:
      pal.text = { ...pal.text, secondary: value };
      break;
    case ColorKey.TextPrimaryButton:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pal.text = { ...pal.text, primaryButton: value };
      break;
    case ColorKey.TextSecondaryButton:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pal.text = { ...pal.text, secondaryButton: value };
      break;
    default:
      pal[color] = { main: value };
  }

  if (cb) {
    cb(themeOptions);
  }
};

export const getDefaultPalletColor = (color: ColorKey) => {
  switch (color) {
    case ColorKey.PaperBackground:
      return palette.background.paper;
    case ColorKey.Primary:
      return palette.primary.main;
    case ColorKey.Secondary:
      return palette.secondary.main;
    case ColorKey.TextPrimary:
      return palette.text.primary;
    case ColorKey.TextSecondary:
      return palette.text.secondary;
    case ColorKey.TextPrimaryButton:
      return palette.text.primaryButton;
    case ColorKey.TextSecondaryButton:
      return palette.text.secondaryButton;
    case ColorKey.SecondaryButton:
      return palette.secondaryButton.main;
    case ColorKey.Error:
      return palette.error.main;
    case ColorKey.Pending:
      return palette.warning.main;
    case ColorKey.Success:
      return palette.success.main;
  }
};

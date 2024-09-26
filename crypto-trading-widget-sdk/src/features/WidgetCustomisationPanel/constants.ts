import { ColorKey } from './components/ColorPicker';
import { WidgetType } from '../../redux/customisationSlice';

export interface ColorParam {
  key: ColorKey;
  name: string;
}

const commonColors = [
  { key: ColorKey.PaperBackground, name: 'Background' },
  { key: ColorKey.Secondary, name: 'Inputs' },
  { key: ColorKey.TextPrimary, name: 'Text primary' },
  { key: ColorKey.TextSecondary, name: 'Text secondary' },
  { key: ColorKey.Primary, name: 'Primary button' },
  { key: ColorKey.TextPrimaryButton, name: 'Primary button text' },
];

export const widgetColors = [
  ...commonColors,
  { key: ColorKey.SecondaryButton, name: 'Secondary button' },
  { key: ColorKey.TextSecondaryButton, name: 'Secondary button text' },
];
export const nftWidgetColors = [...commonColors, { key: ColorKey.PaperSecondaryBackground, name: 'Secondary color' }];

export const notificationColors = [
  { key: ColorKey.Success, name: 'Success' },
  { key: ColorKey.Pending, name: 'Pending and warning' },
  { key: ColorKey.Error, name: 'Error' },
];

export const defaultWidgetType = WidgetType.SWAP;

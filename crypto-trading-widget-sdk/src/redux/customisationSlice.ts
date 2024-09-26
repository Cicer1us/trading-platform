import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chain } from '../utils/chains';
import { ColorKey } from '../features/WidgetCustomisationPanel/components/ColorPicker';
import { getDefaultPalletColor } from '../features/WidgetCustomisationPanel/utils';
import { getTokenList } from '../data/tokens/tokenLists';
import { AVAILABLE_CHAINS } from '../constants';

export enum WidgetType {
  NFT = 'nft',
  SWAP = 'swap',
  SALE = 'sale',
}

export enum SettingTab {
  WIDGET,
  ALERTS,
  CHAINS_AND_TOKENS,
  LISTING,
}

export interface WidgetOptions {
  paletteOverrides: Record<ColorKey, string>;
  chainOptions?: Record<Chain | string, { defaultTokenAddress?: string; enabled: boolean }>;
  widgetType: WidgetType;
}

interface CustomisationState {
  options: WidgetOptions;
  currentSettingsTab: SettingTab;
}

export const createPaletteOverrides = (): Record<ColorKey, string> => {
  const paletteOverrides = Object();
  Object.values(ColorKey).map((value: ColorKey) => {
    paletteOverrides[value] = getDefaultPalletColor(value);
  });
  return paletteOverrides;
};

const createChainOptions = (): Record<Chain, { defaultTokenAddress?: string; enabled: boolean }> => {
  const chainOptions = Object();
  AVAILABLE_CHAINS.map(value => {
    const tokenList = getTokenList(value);
    const defaultTokenAddress = tokenList.find(token => token.symbol === 'USDC')?.address ?? tokenList[0].address;
    chainOptions[value] = { enabled: true, defaultTokenAddress: defaultTokenAddress.toLowerCase() };
  });
  return chainOptions;
};

export const widgetInitialState: CustomisationState = {
  options: {
    paletteOverrides: createPaletteOverrides(),
    chainOptions: createChainOptions(),
    widgetType: WidgetType.SWAP,
  },
  currentSettingsTab: SettingTab.WIDGET,
};

const customisationSlice = createSlice({
  name: 'customisationSlice',
  initialState: widgetInitialState,
  reducers: {
    changeWidgetOptions: (state: CustomisationState, { payload }: PayloadAction<Partial<WidgetOptions>>) => {
      state.options = { ...state.options, ...payload };
    },
    setWidgetType: (state: CustomisationState, { payload }: PayloadAction<WidgetType>) => {
      state.options.widgetType = payload;
    },
    setCurrentSettingsTab: (state: CustomisationState, { payload }: PayloadAction<SettingTab>) => {
      state.currentSettingsTab = payload;
    },
  },
});

export default customisationSlice.reducer;

export const { changeWidgetOptions, setWidgetType, setCurrentSettingsTab } = customisationSlice.actions;

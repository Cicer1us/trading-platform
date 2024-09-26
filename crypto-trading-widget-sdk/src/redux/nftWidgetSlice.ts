import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum NftWidgetScreen {
  DEFAULT,
  SEARCH,
  ALLOWANCE_REQUEST,
  CONNECT_WALLET,
}

interface NftWidgetState {
  takerTokenAddress: string;
  nftWidgetScreen: NftWidgetScreen;
}

const initialState: NftWidgetState = {
  takerTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  nftWidgetScreen: NftWidgetScreen.DEFAULT,
};

const nftWidgetSlice = createSlice({
  name: 'nftWidgetSlice',
  initialState,
  reducers: {
    setTakerTokenAddress: (state, { payload }: PayloadAction<string>) => {
      state.takerTokenAddress = payload;
    },
    setNftWidgetScreen: (state, { payload }: PayloadAction<NftWidgetScreen>) => {
      state.nftWidgetScreen = payload;
    },
  },
});

export default nftWidgetSlice.reducer;

export const { setTakerTokenAddress, setNftWidgetScreen } = nftWidgetSlice.actions;

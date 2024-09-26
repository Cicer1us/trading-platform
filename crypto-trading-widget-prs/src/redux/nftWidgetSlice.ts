import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

//TODO: remove nftWidgetSlice
interface NftWidgetState {
  youReceiveTokenAddress?: string;
}

const initialState: NftWidgetState = {};

const nftWidgetSlice = createSlice({
  name: 'nftWidgetSlice',
  initialState,
  reducers: {
    setYouReceiveTokenAddress: (state: NftWidgetState, action: PayloadAction<string>) => {
      state.youReceiveTokenAddress = action.payload;
    },
  },
});

export const selectYouReceiveTokenAddress = (state: RootState) => state.nftWidgetSlice.youReceiveTokenAddress;

export default nftWidgetSlice.reducer;

export const { setYouReceiveTokenAddress } = nftWidgetSlice.actions;

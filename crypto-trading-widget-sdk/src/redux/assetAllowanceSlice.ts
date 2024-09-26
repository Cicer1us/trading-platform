import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token } from '../data/tokens/token.interface';

interface AssetAllowance {
  token: Token;
  state: 'locked' | 'in progress' | 'error' | 'done';
  errorMgs: string;
}

interface AssetAllowanceState {
  assets: { [key: string]: AssetAllowance };
}

const initialState: AssetAllowanceState = {
  assets: {},
};

const assetAllowanceSlice = createSlice({
  name: 'assetAllowanceSlice',
  initialState,
  reducers: {
    setAssetAllowance: (state, { payload }: PayloadAction<AssetAllowance>) => {
      state.assets[payload.token.address] = payload;
    },
  },
});

export default assetAllowanceSlice.reducer;

export const { setAssetAllowance } = assetAllowanceSlice.actions;

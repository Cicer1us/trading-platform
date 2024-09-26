import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiKeyCredentials } from '@dydxprotocol/v3-client';
import { KeyPairWithYCoordinate } from '@dydxprotocol/starkex-lib';

export type StepStatus = null | 'loading' | 'done';

interface IDydxAuthState {
  apiKeyCredentials?: ApiKeyCredentials;
  apiKeyCredentialsStatus: StepStatus;
  starkPrivateKey?: KeyPairWithYCoordinate;
  starkPrivateKeyStatus?: StepStatus;
  authIsCompleted: boolean;
  authError?: string;
  authStep: number;
  withBalance?: boolean;
  depositTxHash?: string;
}

const initialState: IDydxAuthState = {
  depositTxHash: '',
  apiKeyCredentialsStatus: null,
  starkPrivateKeyStatus: null,
  apiKeyCredentials: null,
  starkPrivateKey: null,
  authIsCompleted: false,
  authError: null,
  authStep: 0,
  withBalance: null,
};

const dydxAuthSlice = createSlice({
  name: 'dydxAuth',
  initialState,
  reducers: {
    setApiKeyCredentials: (
      state: IDydxAuthState,
      { payload }: PayloadAction<{ apiKeyCredentials?: ApiKeyCredentials; apiKeyCredentialsStatus: StepStatus }>
    ) => {
      state.apiKeyCredentials = payload.apiKeyCredentials;
      state.apiKeyCredentialsStatus = payload.apiKeyCredentialsStatus;
    },
    setStarkPrivateKeys: (
      state: IDydxAuthState,
      { payload }: PayloadAction<{ starkPrivateKey?: KeyPairWithYCoordinate; starkPrivateKeyStatus: StepStatus }>
    ) => {
      state.starkPrivateKey = payload.starkPrivateKey;
      state.starkPrivateKeyStatus = payload.starkPrivateKeyStatus;
    },
    setDepositTxHash: (state: IDydxAuthState, { payload }: PayloadAction<string>) => {
      state.depositTxHash = payload;
    },
    setAuthIsCompleted: (state: IDydxAuthState, { payload }: PayloadAction<boolean>) => {
      state.authIsCompleted = payload;
    },
    setDydxAuthToInitial: (state: IDydxAuthState) => {
      state.apiKeyCredentialsStatus = null;
      state.starkPrivateKeyStatus = null;
      state.apiKeyCredentials = null;
      state.starkPrivateKey = null;
      state.authIsCompleted = false;
      state.authError = null;
      state.authStep = 0;
    },
    setAuthError: (state: IDydxAuthState, { payload }: PayloadAction<string | null>) => {
      state.authError = payload;
    },
    incrementStep: (state: IDydxAuthState) => {
      state.authStep = state.authStep + 1;
    },
    setWithBalance: (state: IDydxAuthState, { payload }: PayloadAction<boolean>) => {
      state.withBalance = payload;
    },
  },
});

export default dydxAuthSlice.reducer;

export const {
  setDepositTxHash,
  setApiKeyCredentials,
  setStarkPrivateKeys,
  setAuthIsCompleted,
  setDydxAuthToInitial,
  setAuthError,
  incrementStep,
  setWithBalance,
} = dydxAuthSlice.actions;

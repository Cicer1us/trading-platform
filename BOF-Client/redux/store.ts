import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import dydxAuthSlice from './dydxAuthSlice';
import dydxDataSlice from './dydxDataSlice';
import leverageSlice from './leverageSlice';
import limitSlice from './limitSlice';
import swapSlice from './swapSlice';
import widgetSlice from './widgetSlice';
import crossChainSlice from './crossChainSlice';
const rootReducer = combineReducers({
  app: appSlice,
  widget: widgetSlice,
  dydxAuth: dydxAuthSlice,
  dydxData: dydxDataSlice,
  leverage: leverageSlice,
  swap: swapSlice,
  limit: limitSlice,
  crossChain: crossChainSlice,
});

const setupStore = () => {
  return configureStore({ reducer: rootReducer });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

const store = setupStore();
export default store;

import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import customisationSlice from './customisationSlice';
import assetAllowanceSlice from './assetAllowanceSlice';
import nftWidgetSlice from './nftWidgetSlice';

const rootReducer = combineReducers({
  app: appSlice,
  customisation: customisationSlice,
  assetAllowance: assetAllowanceSlice,
  nftWidget: nftWidgetSlice,
});

const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

const store = setupStore();
export default store;

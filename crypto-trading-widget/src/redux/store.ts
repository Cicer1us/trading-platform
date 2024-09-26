//TODO: remove redux toolkit
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import nftWidgetSlice from './nftWidgetSlice';

const rootReducer = combineReducers({
  app: appSlice,
  nftWidgetSlice: nftWidgetSlice,
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

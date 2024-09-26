import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import modalSlice from './modal/slice';
import paymentSlice from './payment/slice';
import transactionsSlice from './transactions/slice';

const persistConfig = {
  key: 'root',
  storage
};

const rootReducer = combineReducers({
  modal: modalSlice,
  payment: paymentSlice,
  transactions: transactionsSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const setupStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
  const persistor = persistStore(store);

  return { store, persistor };
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['store']['dispatch'];

const { store, persistor } = setupStore();
export { store, persistor };

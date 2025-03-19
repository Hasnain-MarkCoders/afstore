import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from "./slices/authSlice";
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  whiteList: ["auth"]
  // Add any additional config options as needed
};

const persistedReducer = persistReducer(persistConfig, authSlice);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

const persistor = persistStore(store);

export { store, persistor };
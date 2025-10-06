import { configureStore } from '@reduxjs/toolkit';
import googleDriveReducer from './slices/googleDriveSlice';

export const store = configureStore({
  reducer: {
    googleDrive: googleDriveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import api from './api/api'

export const store   = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,

    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  
  }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

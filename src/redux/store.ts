import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import chatReducer from "./reducers/chat";
import api from "./api/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

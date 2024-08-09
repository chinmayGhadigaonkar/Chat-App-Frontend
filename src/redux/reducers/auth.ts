import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: object | null;
  authtoken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authtoken: null,
  isAuthenticated: false,
  loading: false
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.authtoken = action.payload.authtoken;
      localStorage.setItem("authtoken", state.authtoken as string);
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.authtoken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authtoken");
      state.loading = false;
    },
    userExists: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      
      state.loading = false;
    }

  },
});

export const { login, logout,userExists } = auth.actions;

export default auth.reducer;

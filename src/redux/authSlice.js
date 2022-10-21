import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    logout: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    //LOGIN
    loginStart: (state, action) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    //LOGOUT
    logoutStart: (state, action) => {
      //state.logout.isFetching = true;
    },
    logoutSuccess: (state, action) => {
      // state.logout.isFetching = false;
      // state.logout.error = false;
      state.login.currentUser = null;
    },
    logoutFailed: (state, action) => {
      // state.logout.isFetching = false;
      // state.logout.error = true;
    },

  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} = authSlice.actions;
export default authSlice.reducer;

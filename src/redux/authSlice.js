import { createSlice } from "@reduxjs/toolkit";
import { setCategoryData } from "./categoryDataSlice";

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
    edit: {
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
  //EDIT
  editStart: (state, action) => {
    //state.login.isFetching = true;
  },
  editSuccess: (state, action) => {
    //state.login.isFetching = false;
    state.login.currentUser.candidate.address = action.payload.address;
    state.login.currentUser.candidate.dob = action.payload.dob;
    state.login.currentUser.candidate.gender = action.payload.gender;
    state.login.currentUser.candidate.image = action.payload.image;
    state.login.currentUser.candidate.name = action.payload.name;
    state.login.currentUser.candidate.phone = action.payload.phone;
    //state.login.error = false;
  },
  editFailed: (state, action) => {
    //state.login.isFetching = false;
    //.login.error = true;
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
  editStart,
  editSuccess,
  editFailed,
} = authSlice.actions;
export default authSlice.reducer;

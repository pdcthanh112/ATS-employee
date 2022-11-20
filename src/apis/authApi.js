import axiosConfig from "../configs/axiosConfig";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
} from "../redux/authSlice";

export const loginUser = async (user, dispatch, navigate) => {
  console.log('user', user);
  dispatch(loginStart());
  try {
    const response = await axiosConfig.post("/auth/login", user);
    if (response) {
      dispatch(loginSuccess(response.data.data));
      navigate("/#/");
    }
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(logoutFailed());
  }
};

export const changePassword = async (email, newPassword, oldPassword) => {
  return axiosConfig
    .patch("auth/change-password", {
      email: email,
      newPassword: newPassword,
      oldPassword: oldPassword,
    })
    .then((response) => response)
    .catch((error) => error);
};

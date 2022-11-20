import axiosConfig from "../configs/axiosConfig";

export const getTotalStatusDetail = async (token) => {
  return await axiosConfig
    .get('planDetail/getTotalStatusDetail', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
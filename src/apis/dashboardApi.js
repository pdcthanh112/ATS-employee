import axiosConfig from "../configs/axiosConfig";

export const getTotalStatusDetail = async () => {
  return await axiosConfig
    .get('planDetail/getTotalStatusDetail')
    .then((response) => response.data)
    .catch((error) => {throw error});
};
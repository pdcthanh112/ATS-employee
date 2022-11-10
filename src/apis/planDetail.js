import axiosConfig from "../configs/axiosConfig";

export const getAllPlanDetail = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`planDetail/getAll?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

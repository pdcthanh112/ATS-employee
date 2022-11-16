import axiosConfig from "../configs/axiosConfig";

export const getPositionByDepartment = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`position/getPositionByDepartment?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
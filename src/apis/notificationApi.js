import axiosConfig from "../configs/axiosConfig";

export const getNotificationByEmployee = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`notification/getByEmployee?employeeId=${id}&pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

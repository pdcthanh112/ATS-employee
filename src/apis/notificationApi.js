import axiosConfig from "../configs/axiosConfig";

export const getNotificationByEmployee = async (id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`notification/getByEmployee?employeeId=${id}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

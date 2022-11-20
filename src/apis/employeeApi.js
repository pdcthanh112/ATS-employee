import axiosConfig from "../configs/axiosConfig";

export const getEmployeeByDepartment = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`employee/getEmployeesByDepartment?departmentId=${id}&pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getEmployeeByRecruitmentRequest = async (token, id) => {
  return await axiosConfig
    .get(`employee/getEmployeeByRequest?requestId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
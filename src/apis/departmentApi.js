import axiosConfig from "../configs/axiosConfig";

// export const getAllDepartment = async (token, pageNo, pageSize) => {
//   return await axiosConfig
//     .get(`department/getAll?pageNo=${pageNo}&pageSize=${pageSize}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then((response) => response.data)
//     .catch((error) => error);
// };

export const getIdAndNameActiveDepartment = async () => {
  return await axiosConfig
    .get('department/getIdName')
    .then((response) => response.data)
    .catch((error) => error);
};

export const getJobApplyByDepartment = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`position/getPositionByDepartment?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getPositionByDepartment = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`position/getPositionByDepartment?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
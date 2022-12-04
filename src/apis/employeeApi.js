import axiosConfig from "../configs/axiosConfig";
import { editFailed, editStart, editSuccess } from "../redux/authSlice";

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

export const editProfileEmployee = async (id, token, data, dispatch) => {
  return await axiosConfig
    .put(
      `employee/update/{id}?id=${id}`,
      {
        address: data.address,
        dob: data.dateOfBirth,
        gender: data.gender,
        image: data.image,
        name: data.fullname,
        phone: data.phone,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => dispatch(editFailed()));
};

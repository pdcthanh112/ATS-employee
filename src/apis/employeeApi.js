import axiosConfig from "../configs/axiosConfig";

export const getEmployeeByDepartment = async (token, id) => {
  return await axiosConfig
    .get(`candidate/getCandidateAppliedByRecruitment?recruitmentId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
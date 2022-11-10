import axiosConfig from "../configs/axiosConfig";

export const getAllRecruimentPlan = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`recruitmentPlan/getAllRecruitmentPlans?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const createRecruitmentPlan = async (token, planData) => {
  return await axiosConfig
    .post(
      "recruitmentPlan/create",
      {
        amount: planData.amount,
        creatorId: planData.creatorId,
        periodFrom: planData.periodFrom,
        periodTo: planData.periodTo,
        totalSalary: planData.totalSalary,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

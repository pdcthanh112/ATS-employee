import axiosConfig from "../configs/axiosConfig";

export const getAllPlanDetail = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`planDetail/getAll?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getPlanApprovedByDepartment = async (token, depId) => {
  return await axiosConfig
    .get(`recruitmentPlan/getPlanApprovedByDepartment?departmentId=${depId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createPlanDetail = async (planData, token) => {
  return await axiosConfig
    .post(
      "recruitmentPlan/create",
      {
        amount: planData.amount,
        creatorId: planData.creatorId,
        description: planData.description,
        name: planData.name,
        note: planData.note,
        periodFrom: planData.periodFrom,
        periodTo: planData.periodTo,
        positionName: planData.positionName,
        reason: planData.reason,
        recruitmentPlanId: planData.recruitmentPlanId,
        requirement: planData.requirement,
        salary: planData.salary,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

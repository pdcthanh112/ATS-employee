import axiosConfig from "../configs/axiosConfig";

export const getAllPlanDetail = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`planDetail/getAll?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getPlanDetailById = async (token, id) => {
  return await axiosConfig
    .get(`planDetail/getById/{id}?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getPlanDetailApprovedByDepartment = async (token, depId) => {
  return await axiosConfig
    .get(`planDetail/getApprovedByDepartment?departmentId=${depId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createPlanDetail = async (planData, token) => {
  console.log('api', planData);
  return await axiosConfig
    .post(
      "planDetail/create",
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

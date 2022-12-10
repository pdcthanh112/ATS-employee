import axiosConfig from "../configs/axiosConfig";

export const getAllPlanDetail = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(`planDetail/getAll?pageNo=${pageNo}&pageSize=${pageSize}`)
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

export const getPlanDetailByDepartment = async (depId, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `planDetail/getByDepartment?id=${depId}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
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

export const approvePlanDetail = async (empId, planId) => {
  return await axiosConfig
    .put("planDetail/approved", {
      employeeId: empId,
      id: planId,
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const cancelPlanDetail = async (empId, planId) => {
  return await axiosConfig.put("planDetail/canceled", {
    employeeId: empId,
    id: planId,
  });
};

export const editPlanDetail = async (token, id, planData) => {
  return await axiosConfig
    .put(
      `planDetail/update?id=${id}`,
      {
        amount: planData.amount,
        description: planData.description,
        name: planData.name,
        note: planData.note,
        periodFrom: planData.periodFrom,
        periodTo: planData.periodTo,
        positionName: planData.positionName,
        reason: planData.reason,
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

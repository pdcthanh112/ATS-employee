import axiosConfig from "../configs/axiosConfig";

export const getAllRecruimentPlan = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(`recruitmentPlan/getAllRecruitmentPlans?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAllApproveRecruimentPlan = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `recruitmentPlan/getAllApprovedRecruitmentPlans?pageNo=${pageNo}&pageSize=${pageSize}`,)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getRecruimentPlanByDepartment = async (
  departmentId,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `recruitmentPlan/getByDepartment?departmentId=${departmentId}&pageNo=${pageNo}&pageSize=${pageSize}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getPlanApprovedByDepartment = async (depId) => {
  return await axiosConfig
    .get(`recruitmentPlan/getPlanApprovedByDepartment?departmentId=${depId}`)
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
        name: planData.name,
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

export const editRecruitmentPlan = async (planId, planData) => {
  return await axiosConfig
    .put(
      `recruitmentPlan/update/{id}?id=${planId}`,
      {
        amount: planData.amount,
        name: planData.name,
        periodFrom: planData.periodFrom,
        periodTo: planData.periodTo,
        totalSalary: planData.totalSalary,
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const approveRecruitmentPlan = async (empId, planId) => {
  return await axiosConfig
    .put(
      "recruitmentPlan/approved",
      {
        employeeId: empId,
        id: planId,
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const rejectRecruitmentPlan = async (empId, planId) => {
  return await axiosConfig
    .put(
      "recruitmentPlan/canceled",
      {
        employeeId: empId,
        id: planId,
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

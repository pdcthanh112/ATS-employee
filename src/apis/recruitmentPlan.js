import axiosConfig from "../configs/axiosConfig";

export const getAllRecruimentPlan = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `recruitmentPlan/getAllRecruitmentPlans?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAllApproveRecruimentPlan = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `recruitmentPlan/getAllApprovedRecruitmentPlans?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getRecruimentPlanByDepartment = async (
  token,
  departmentId,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `recruitmentPlan/getByDepartment?departmentId=${departmentId}&pageNo=${pageNo}&pageSize=${pageSize}`,
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

export const approveRecruitmentPlan = async (token, empId, planId) => {
  return await axiosConfig
    .put("recruitmentPlan/approved", {
      headers: { Authorization: `Bearer ${token}` },
      body: { employeeId: empId, id: planId },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

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
      //headers: { Authorization: `Bearer ${token}` },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiTUFOQUdFUiJ9XSwiZW1haWwiOiJuaGR1b25nMmtAZ21haWwuY29tIiwiYWNjb3VudElkIjo1LCJpYXQiOjE2NjgxMzQ5NzIsImV4cCI6MTY2ODIxMTIwMH0.uhA5uL4aofyPWww4r-3_3481OoK_X-_n5tDGq8joaTpuKIB8c7ftQarhq787r8KCvORHRR51LsmsGWRK0AhaGA`,
      },
      body: { employeeId: empId, id: planId },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

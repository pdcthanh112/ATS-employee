import axiosConfig from "../configs/axiosConfig";

export const getJobApplyNotReject = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `jobApply/getJobApplyNotReject?pageNo=${pageNo}&pageSize=${pageSize}&recruitmentRequestId=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getJobApplyPassScreening = async (reqId, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `jobApply/getJobApplyPassScreening?pageNo=${pageNo}&pageSize=${pageSize}&recruitmentRequestId=${reqId}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};
export const getJobApplyFailScreening = async (reqId, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `jobApply/getJobApplyFailScreening?pageNo=${pageNo}&pageSize=${pageSize}&recruitmentRequestId=${reqId}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const approveJobApply = async (id, empId) => {
  return await axiosConfig
    .put(`jobApply/approvedJobApply/{id}?employeeId=${empId}&id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error.data.message;
    });
};

export const rejectJobApply = async (id, empId) => {
  return await axiosConfig
    .put(`jobApply/cancelJobApply/{id}?employeeId=${empId}&id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error.data.message;
    });
};

export const applyJob = async (token, data) => {
  return await axiosConfig
    .post(
      "/jobApply/createJobApplyByEmployee",
      {
        employeeId: data.employeeId,
        listJobApplyByEmployee: data.listJobApplyByEmployee,
        requestId: data.requestId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const inviteReapply = async (data) => {
  return await axiosConfig
    .post("/notification/inviteReapply", {
      content: data.content,
      cvIds: data.cvIds,
      title: data.title,
    })
    .then((response) => response.data)
    .catch((error) => error.data.message);
};

export const screeningSetting = async (data) => {
  return await axiosConfig
    .put("jobApply/screeningSetting", {
      city: data.city,
      educationLevel: data.educationLevel,
      experience: data.experience,
      foreignLanguage: data.foreignLanguage,
      percentRequired: data.percentRequired,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.data.message;
    });
};

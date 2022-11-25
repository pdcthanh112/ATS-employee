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

export const getJobApplyPassScreening = async (
  token,
  reqId,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `jobApply/getJobApplyPassScreening?pageNo=${pageNo}&pageSize=${pageSize}&recruitmentRequestId=${reqId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};
export const getJobApplyFailScreening = async (
  token,
  reqId,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `jobApply/getJobApplyFailScreening?pageNo=${pageNo}&pageSize=${pageSize}&recruitmentRequestId=${reqId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const approveJobApply = async (token, id, empId) => {
  return await axiosConfig
    .put(
      `jobApply/approvedJobApply/{id}?employeeId=${empId}&id=${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const rejectJobApply = async (token, id, empId) => {
  return await axiosConfig
    .put(
      `jobApply/cancelJobApply/{id}?employeeId=${empId}&id=${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};
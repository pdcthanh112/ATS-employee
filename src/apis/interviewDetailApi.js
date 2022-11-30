import axiosConfig from "../configs/axiosConfig";

export const getAllInterviewDetail = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview-detail/getAllInterviewDetail?pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getInterviewDetailByDepartment = async (
  token,
  depName,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `interview-detail/getAllInterviewDetailByDepartment?departmentName=${depName}&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const createInterviewDetail = async (token, data) => {
  return await axiosConfig
    .post(
      "interview-detail/createInterviewDetail",
      {
        description: data.description,
        end: data.end,
        interviewID: data.interviewID,
        note: data.note,
        recommendPositions: data.recommendPositions,
        recordMeeting: data.recordMeeting,
        result: data.result,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const editInterviewDetail = async (token, detailId, data) => {
  return await axiosConfig
    .put(
      `interview-detail/updateInterviewDetail?id=${detailId}`,
      {
        description: data.description,
        end: data.end,
        interviewID: data.interviewID,
        note: data.note,
        recommendPositions: data.recommendPositions,
        recordMeeting: data.recordMeeting,
        result: data.result,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

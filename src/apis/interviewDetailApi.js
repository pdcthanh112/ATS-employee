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

export const createInterviewDetail = async (token, data) => {
  return await axiosConfig
    .post(
      'interview-detail/createInterviewDetail',
      {
        description: data.description,
        end: data.end,
        interviewID: data.interviewID,
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

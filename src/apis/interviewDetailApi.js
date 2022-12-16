import axiosConfig from "../configs/axiosConfig";

export const getAllInterviewDetail = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview-detail/getAllInterviewDetail?pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getInterviewDetailByDepartment = async (
  depName,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `interview-detail/getAllInterviewDetailByDepartment?departmentName=${depName}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const createInterviewDetail = async (data) => {
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
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const editInterviewDetail = async (data) => {
  return await axiosConfig
    .put(`interview-detail/updateInterviewDetail?id=${data.detailId}`, {
      description: data.description,
      end: data.end,
      interviewID: data.interviewID,
      note: data.note,
      recommendPositions: data.recommendPositions.toString(),
      recordMeeting: data.recordMeeting,
      result: data.result,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

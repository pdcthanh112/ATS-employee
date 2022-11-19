import axiosConfig from "../configs/axiosConfig";

export const getAllInterviewDetail = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`interview-detail/getAllInterviewDetail?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
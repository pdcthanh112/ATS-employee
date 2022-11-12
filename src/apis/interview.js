import axiosConfig from "../configs/axiosConfig";

export const getInterviewByCandidateId = async (candidateId, token) => {
  return await axiosConfig
    .get(`interview/getInterviewByCandidateID?candidateId=${candidateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAllInterview = async (token, pageNo, pageSize) => {
  return await axiosConfig.get(`interview/getAllInterview?pageNo=${pageNo}&pageSize=${pageSize}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((response) => response.data)
  .catch((error) => error);
}

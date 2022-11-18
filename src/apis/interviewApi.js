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
  return await axiosConfig
    .get(`interview/getAllInterview?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getInterviewByDepartment = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`interview/getAllInterview?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createInterview = async (token, data) => {
  return await axiosConfig
    .post(
      "interview/createInterview",
      {
        address: data.address,
        candidateId: data.candidateId,
        date: data.date,
        description: data.description,
        employeeId: data.employeeId,
        recruitmentRequestId: data.recruitmentRequestId,
        linkMeeting: data.linkMeeting,
        purpose: data.purpose,
        room: data.room,
        round: data.round,
        subject: data.subject,
        time: data.time,
        type: data.type,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const confirmInterview = async (token, employeeId, interviewId) => {
  return await axiosConfig
    .patch(
      `interview/confirmByEmployee?idEmployee=${employeeId}&idInterview=${interviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

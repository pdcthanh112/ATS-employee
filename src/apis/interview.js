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

export const createRecruitmentRequest = async (data, token) => {
  return await axiosConfig
    .post(
      "interview/createInterview",
      {
        address: data.address,
        candidateId: 0,
        date: data.date,
        description: data.description,
        employeeId: data.employeeId,
        jobApplyId: data.jobApplyId,
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

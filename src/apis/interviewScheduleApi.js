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

export const getInterviewByDepartment = async (
  token,
  depId,
  pageNo,
  pageSize
) => {
  return await axiosConfig
    .get(
      `interview/getInterviewByDepartment?departmentId=${depId}&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getInterviewByEmployee = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview/getInterviewByEmployeeID?employeeId=${id}&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAcceptableInterviewByEmployee = async (token, empId, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview/getAcceptableByEmployee?employeeId=${empId}&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAcceptableInterviewByDepartment = async (token, depId, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview/getAcceptableByDepartment?departmentId=${depId}&pageNo=${pageNo}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const searchInterviewSchedule = async (token, data) => {
  return await axiosConfig
    .put(
      "interview/searchInterview",
      {
        candidateName: data.name,
        date: data.date,
        round: data.round,
        status: data.status.toUpperCase(),
        type: data.type.toUpperCase(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
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
      `interview/confirmByEmployee?idEmployee=${employeeId}&idInterview=${interviewId}`, {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const rejectInterview = async (token, employeeId, interviewId) => {
  return await axiosConfig
    .patch(
      `interview/rejectByEmployee?idEmployee=${employeeId}&idInterview=${interviewId}`, {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const cancelInterview = async (token, data) => {
  console.log(data);
  return await axiosConfig
    .patch(
      `interview/cancelInterview`,
      {
        interviewId: data.interviewId,
        reason: data.reason,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const closeInterview = async (token, id) => {
  return await axiosConfig
    .put(`interview/closeInterview?id=${id}`, {},
    {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const getStatusAndName = async (token, interviewId) => {
  return await axiosConfig
    .get(`interview/getNameAndStatus?interviewId=${interviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const confirmByManager = async (token, interviewId) => {
  return await axiosConfig
    .patch(
      `interview/confirmByManager?idInterview=${interviewId}`, {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};
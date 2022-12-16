import axiosConfig from "../configs/axiosConfig";

export const getAllInterview = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(`interview/getAllInterview?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getInterviewByDepartment = async (depId, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview/getInterviewByDepartment?departmentId=${depId}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getInterviewByEmployee = async (id, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `interview/getInterviewByEmployeeID?employeeId=${id}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const searchInterviewSchedule = async (data) => {
  return await axiosConfig
    .put("interview/searchInterview", {
      candidateName: data.name,
      date: data.date,
      round: data.round,
      status: data.status.toUpperCase(),
      type: data.type.toUpperCase(),
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const createInterview = async (data) => {
  return await axiosConfig
    .post("interview/createInterview", {
      address: data.address,
      candidateId: data.candidateId,
      date: data.date,
      description: data.description,
      duration: data.duration,
      employeeId: data.employeeId,
      recruitmentRequestId: data.recruitmentRequestId,
      linkMeeting: data.linkMeeting,
      purpose: data.purpose,
      room: data.room,
      round: data.round,
      subject: data.subject,
      time: data.time,
      type: data.type,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const confirmInterview = async (employeeId, interviewId) => {
  return await axiosConfig
    .patch(
      `interview/confirmByEmployee?idEmployee=${employeeId}&idInterview=${interviewId}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const rejectInterview = async (employeeId, interviewId) => {
  return await axiosConfig
    .patch(
      `interview/rejectByEmployee?idEmployee=${employeeId}&idInterview=${interviewId}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const cancelInterview = async (data) => {
  return await axiosConfig
    .patch(`interview/cancelInterview`, {
      interviewId: data.interviewId,
      reason: data.reason,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const closeInterview = async (id) => {
  return await axiosConfig
    .put(`interview/closeInterview?id=${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const getStatusAndName = async (interviewId) => {
  return await axiosConfig
    .get(`interview/getNameAndStatus?interviewId=${interviewId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const confirmByManager = async (interviewId) => {
  return await axiosConfig
    .patch(`interview/confirmByManager?idInterview=${interviewId}`)
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

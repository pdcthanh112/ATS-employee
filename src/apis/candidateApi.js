import axiosConfig from "../configs/axiosConfig";

export const getAllCandidate = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(`candidate/getAllCandidates?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAllActivateCandidate = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `candidate/getAllActivateCandidates?pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getCandidateById = async (id, token) => {
  return await axiosConfig
    .get(`candidate/getCandidateById/{Id}?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const updateProfileCandidate = async (id, token, data) => {
  return await axiosConfig
    .put(
      `candidate/update/{id}?id=${id}`,
      {
        address: data.address,
        dob: data.dateOfBirth,
        gender: data.gender,
        image: data.image,
        name: data.fullname,
        phone: data.phone,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const getCVByCandidate = async (id, pageNo, pageSize) => {
  return await axiosConfig
    .get(
      `cv/getAllCvByCandidate?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then((response) => response.data)
    .catch((error) => error);
};

export const createCandidate = async (data) => {
  return await axiosConfig
    .post("/auth/register", {
      address: data.address,
      dob: data.dob,
      email: data.email,
      gender: data.gender,
      image: data.image,
      name: data.name,
      password: data.password,
      phone: data.phone,
    })
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const getCandidateAppliedByRecruitmentRequest = async (id) => {
  return await axiosConfig
    .get(`candidate/getCandidateAppliedByRecruitment?recruitmentId=${id}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getIdAndNameAcitveCandidate = async (token) => {
  return await axiosConfig
    .get("candidate/getIdAndNameAcitveCandidate", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const disableCandidate = async (candidateId) => {
  return await axiosConfig
    .delete(`candidate/delete/{id}?id=${candidateId}`)
    .then((response) => response.data)
    .catch((error) => error);
};

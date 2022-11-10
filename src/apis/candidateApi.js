import axiosConfig from "../configs/axiosConfig";

export const getAllCandidate = async (pageNo, pageSize, token) => {
  return await axiosConfig
    .get(`candidate/getAllCandidates?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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

export const getCVByCandidate = async (token, id, pageNo, pageSize) => {
  return await axiosConfig
    .get(`cv/getAllCvByCandidate?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
}

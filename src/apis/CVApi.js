import axiosConfig from "../configs/axiosConfig";

export const getCVStorage = async (token, pageNo, pageSize) => {
  return await axiosConfig
    .get(`cv/getCvStorage?pageNo=${pageNo}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAllSourceCV = async (token) => {
  return await axiosConfig
    .get("cv/getAllSourceCV", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

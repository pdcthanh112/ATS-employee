import axiosConfig from "../configs/axiosConfig";

export const getCVStorage = async () => {
  return await axiosConfig
    .get('cv/getCvStorage')
    .then((response) => response.data)
    .catch((error) => error);
};

export const getAllSourceCV = async () => {
  return await axiosConfig
    .get("cv/getAllSourceCV")
    .then((response) => response.data)
    .catch((error) => error);
};

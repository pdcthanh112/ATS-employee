import axiosConfig from "../configs/axiosConfig";

export const getReport = async () => {
  return await axiosConfig
    .get("report/getReport")
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

import axiosConfig from "../configs/axiosConfig";

export const getReport = async () => {
  return await axiosConfig
    .get("report/getReport")
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const getYearFromPlan = async () => {
  return await axiosConfig
    .get("report/getYearFromPlan")
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const searchReport = async (data) => {
  console.log(data);
  return await axiosConfig
    .put("report/search", {
      departmentName: data.departmentName,
      year: data.year
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

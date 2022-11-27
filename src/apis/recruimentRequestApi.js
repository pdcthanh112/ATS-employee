import axiosConfig from "../configs/axiosConfig";
import { setCategoryData } from "../redux/categoryDataSlice";

export const getAllRecruimentRequest = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(`recruitmentRequest/getAll?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getOpeningRecruimentRequest = async (pageNo, pageSize) => {
  return await axiosConfig
    .get(`recruitmentRequest/getOpenRecruitmentRequest?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getRecruimentRequestById = async (id) => {
  return await axiosConfig
    .get(`recruitmentRequest/getById?id=${id}`)
    .then((response) => response.data)
    .catch((error) => error);
};

export const getListRecruimentRequestByDepartment = async (token, id) => {
  return await axiosConfig
    .get(`recruitmentRequest/getIdAndNameByDepartment?department_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const searchRecruimentRequest = async (searchObject) => {
  console.log("apii", searchObject);
  return await axiosConfig
    .put("recruitmentRequest/searchRecruitmentRequest", {
      experience: searchObject.experience,
      industry: searchObject.industry,
      jobLevel: searchObject.jobLevel,
      jobTitle: searchObject.jobTitle,
      location: searchObject.location,
      salary: searchObject.salary,
      typeOfWork: searchObject.typeOfWork,
    })
    .then((response) => response.data)
    .catch((error) => error);
};

export const getCategory = async (dispatch) => {
  const response = await axiosConfig.get("recruitmentRequest/getCategory");
  if (response) {
    dispatch(setCategoryData(response.data.data));
  }
};

export const createRecruitmentRequest = async (data, token) => {
  return await axiosConfig
    .post(
      "recruitmentRequest/create",
      {
        address: data.address,
        amount: data.amount,
        benefit: data.benefit,
        cityName: data.cityName,
        description: data.description,
        educationLevel: data.educationLevel,
        employeeId: data.employeeId,
        experience: data.experience,
        expiryDate: data.expiryDate,
        foreignLanguage: data.foreignLanguage,
        industry: data.industry,
        name: data.name,
        jobLevel: data.jobLevel,
        planDetailId: data.planDetailId,
        positionName: data.positionName,
        requirement: data.requirement,
        salaryFrom: data.salaryFrom,
        salaryTo: data.salaryTo,
        typeOfWork: data.typeOfWork,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data)
    .catch((error) => error.response.data);
};

export const getIdAndNameActiveRequest = async (token) => {
  return await axiosConfig
    .get('recruitmentRequest/getAllActiveRequest', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => error);
};
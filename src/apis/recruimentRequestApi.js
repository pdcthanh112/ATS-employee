import axiosConfig from "../configs/axiosConfig";

export const getAllRecruimentRequest = async (pageNo, pageSize) => {  
    return await axiosConfig.get(`recruitmentRequest/getAll?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then(response => response.data)
    .catch(error => error)
} 

export const getRecruimentRequestDetail = async (id) => {  
    return await axiosConfig.get(`recruitmentRequest/getById/{id}?id=${id}`)
    .then(response => response)
    .catch(error => error)
} 

export const searchRecruimentRequest = async (searchObject) => { 
    console.log('apii', searchObject); 
    return await axiosConfig.put('recruitmentRequest/searchRecruitmentRequest', {
        experience: searchObject.experience,
        industry: searchObject.industry,
        jobLevel: searchObject.jobLevel,
        jobTitle: searchObject.jobTitle,
        location: searchObject.location,
        salary: searchObject.salary,
        typeOfWork: searchObject.typeOfWork
    })
    .then(response => response.data)
    .catch(error => error)
} 

export const getSearchCategory = async () => {  
    return await axiosConfig.get('recruitmentRequest/getSearchCategory')
    .then(response => response.data)
    .catch(error => error)
} 


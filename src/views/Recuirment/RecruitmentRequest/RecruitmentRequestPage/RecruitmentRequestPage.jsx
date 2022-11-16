import React, { useState, useEffect } from 'react'
import './RecruitmentRequestPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'
import RequestIcon from '../../../../assets/icon/recruitment-requestImage.png'
import SearchIcon from '../../../../assets/icon/filter.png'
import AddIcon from '../../../../assets/icon/plus.png'
import CurrencyFormat from 'react-currency-format';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Modal, Pagination, Stack, TextField, Autocomplete, TextareaAutosize, FormControlLabel, Checkbox } from '@mui/material';
import { createRecruitmentRequest, getAllRecruimentRequest, getApprovedByDepartment } from '../../../../apis/recruimentRequestApi'
import ListRecruitmentRequest from '../ListRecruitmentRequest/ListRecruitmentRequest'
import { educationLevelData, experienceData, foreignLanguageData, typeOfWorkData } from '../../../../utils/dropdownData'
import { responseStatus } from '../../../../utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruitmentRequestPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listApprovedPlanDetail, setListApprovedPlanDetail] = useState([])

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getAllRecruimentRequest(pagination.currentPage - 1, 2);
      if (response) {
        setListRecruitmentRequest(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getApprovedByDepartment(currentUser.employee.department.id, currentUser.token);
      if (response) {
        setListApprovedPlanDetail(response.data)
      }
    }
    fetchData();
  }, [])



  const handleChangeSearchObject = (id, value) => {
    // setSearchObject(() => ({
    //   ...searchObject,
    //   [id]: value
    // }))
  }

  const onHandleSearch = () => {
    console.log('search');
    // searchRecruimentRequest(searchObject).then((response) => {
    //   console.log(response.data);
    //   if (response.data.length > 0) {
    //     setListRecruitment(response.data)
    //     setSearchError(false)
    //   } else {
    //     setSearchError(true)
    //     setPagination({ ...pagination, currentPage: 1 })
    //   }
    // })
  };

  const formik = useFormik({
    initialValues: {
      address: '',
      amount: 0,
      benefit: '',
      cityName: '',
      description: '',
      educationLevel: '',
      employeeId: currentUser?.employee.id,
      experience: '',
      expiryDate: '',
      foreignLanguage: '',
      industry: '',
      jobLevel: '',
      planDetailId: '',
      positionName: '',
      requirement: '',
      salaryFrom: 'Negotiable',
      salaryTo: 'Negotiable',
      typeOfWork: ''
    },
    validationSchema: Yup.object({
      address: Yup.string().required('Please input address'),
      amount: Yup.number().positive('Invalid value').integer(),
      benefit: Yup.string().required('Please input benefit'),
      cityName: Yup.string().required('Please choose city name'),
      description: Yup.string().required('Please input description'),
      educationLevel: Yup.string().required('Please choose education level'),
      experience: Yup.string().required('Please choose experience'),
      expiryDate: Yup.string().required('Please choose expired date'),
      foreignLanguage: Yup.string().required('Please choose forign language'),
      industry: Yup.string().required('Please input industry'),
      jobLevel: Yup.string().required('Please input job level'),
      planDetailId: Yup.string().required('Please choose recruitment plan'),
      positionName: Yup.string().required('Please choose position'),
      requirement: Yup.string().required('Please input requirement'),
      salaryFrom: Yup.string().required('Please input salary range'),
      salaryTo: Yup.string().required('Please input salary range'),
      typeOfWork: Yup.string().required('Please choose type of work'),
    }),
    onSubmit: async (values) => {
      console.log('val', values);
      await createRecruitmentRequest(values, currentUser.token).then(response => {
        console.log(response);
        if(response.message.includes(' expiry date')) {
          formik.errors.expiryDate="Invalid expiry date"
        }
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Something error')
      })
    }
  })

  return (
    <React.Fragment>
      <div className='recruitmentrequest-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Recruitment Request</span>
          <img src={RequestIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-request hover:cursor-pointer' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
          <span className='mr-1'>Create recruitment request</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={AddIcon} alt='' /></span>
        </div>

        <div className='filter-container'>
          <div className='inputName'>
            <input type={'text'} className='form-control' placeholder='Nhập tên ứng viên...' onChange={(event) => { handleChangeSearchObject('name', event.target.value) }} />
          </div>
          <Autocomplete
            //options={typeOfWorkData()}
            size={'small'}
            sx={{ width: 170, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Loại công việc" />}
            onChange={(event, value) => { handleChangeSearchObject('typeOfWork', value.value) }} />

          <Autocomplete
            //options={typeOfWorkData()}
            size={'small'}
            sx={{ width: 170, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Loại công việc" />}
            onChange={(event, value) => { handleChangeSearchObject('typeOfWork', value.value) }} />

          <img src={SearchIcon} alt="" width={'50rem'} title='Search' onClick={() => onHandleSearch()} />
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListRecruitmentRequest listRecruitmentRequest={listRecruitmentRequest} />}

        <div className='pagination-container'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
        <Box sx={style}>
          <div className='modalCreateRequest-container'>
            <div className='modalCreateRequest-title'>
              <span className='font-medium text-3xl mr-3'>Create recruitment request</span>
              <img src={RequestIcon} alt='' width={'30rem'} />
            </div>
            <div className='modalCreateRequest-content'>
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <Autocomplete
                        options={categoryData.position}
                        size={'small'}
                        sx={{ width: '80%', marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Position" />}
                        onInputChange={(event, value) => { formik.setFieldValue('positionName', value) }} />
                      {formik.errors.positionName && formik.touched.positionName && (
                        <div className='text-[#ec5555]'>{formik.errors.positionName}</div>
                      )}
                    </div>
                    <div>
                      <TextField label="Job level" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='jobLevel' value={formik.values.jobLevel} onChange={formik.handleChange} />
                      {formik.errors.jobLevel && formik.touched.jobLevel && (
                        <div className='text-[#ec5555]'>{formik.errors.jobLevel}</div>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <Autocomplete
                        options={experienceData()}
                        size={'small'}
                        sx={{ width: '80%', marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Experience" />}
                        onInputChange={(event, value) => { formik.setFieldValue('experience', value) }} />
                      {formik.errors.experience && formik.touched.experience && (
                        <div className='text-[#ec5555]'>{formik.errors.experience}</div>
                      )}
                    </div>
                    <div>
                      <Autocomplete
                        options={typeOfWorkData()}
                        size={'small'}
                        sx={{ width: '100%', marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Type of work" />}
                        onInputChange={(event, value) => { formik.setFieldValue('typeOfWork', value) }} />
                      {formik.errors.typeOfWork && formik.touched.typeOfWork && (
                        <div className='text-[#ec5555]'>{formik.errors.typeOfWork}</div>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <Autocomplete
                        options={educationLevelData()}
                        size={'small'}
                        sx={{ width: '80%', marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Education level" />}
                        onInputChange={(event, value) => { formik.setFieldValue('educationLevel', value) }} />
                      {formik.errors.educationLevel && formik.touched.educationLevel && (
                        <div className='text-[#ec5555]'>{formik.errors.educationLevel}</div>
                      )}
                    </div>
                    <div>
                      <Autocomplete
                        options={foreignLanguageData()}
                        size={'small'}
                        sx={{ marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Foreign language" />}
                        onInputChange={(event, value) => { formik.setFieldValue('foreignLanguage', value) }} />
                      {formik.errors.foreignLanguage && formik.touched.foreignLanguage && (
                        <div className='text-[#ec5555]'>{formik.errors.foreignLanguage}</div>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <Autocomplete
                        options={categoryData.industry}
                        size={'small'}
                        sx={{ width: '80%', marginTop: '1rem' }}
                        renderInput={(params) => <TextField {...params} label="Industry" />}
                        onInputChange={(event, value) => { formik.setFieldValue('industry', value) }} />
                      {formik.errors.industry && formik.touched.industry && (
                        <div className='text-[#ec5555]'>{formik.errors.industry}</div>
                      )}
                    </div>
                    <div>
                      <TextField label="Amount" variant="outlined" size='small' sx={{ marginTop: '1rem', width: '100%' }} name='amount' value={formik.values.amount} onChange={formik.handleChange} />
                      {formik.errors.amount && formik.touched.amount && (
                        <div className='text-[#ec5555]'>{formik.errors.amount}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Autocomplete
                      options={listApprovedPlanDetail}
                      size={'small'}
                      sx={{ width: '100%', marginTop: '1rem' }}
                      getOptionLabel={option => option.name}
                      renderInput={(params) => <TextField {...params} label="Plan detail" />}
                      onChange={(event, value) => { formik.setFieldValue('planDetailId', value.id) }} />
                    {formik.errors.planDetailId && formik.touched.planDetailId && (
                      <div className='text-[#ec5555]'>{formik.errors.planDetailId}</div>
                    )}
                  </div>

                  <div className='mt-4 ml-14 font-semibold'>Expired date</div>
                  <div className='flex justify-center'>
                    <TextField type={'date'} variant="outlined" size='small' style={{ width: '80%' }} name='expiryDate' value={formik.values.expiryDate} onChange={formik.handleChange} />
                  </div>
                  {formik.errors.expiryDate && formik.touched.expiryDate && (
                    <div className='text-[#ec5555] w-[80%] ml-12'>{formik.errors.expiryDate}</div>
                  )}

                  <div className='mt-3 ml-2 font-semibold text-lg'>Salary</div>
                  <div className='inline-flex'>
                    <div className='w-[40%]'>
                      <div>from</div>
                      <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='salaryFrom' placeholder='1,000,000 VNĐ' value={formik.values.salaryFrom} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '90%' }} />
                      {formik.errors.salaryFrom && formik.touched.salaryFrom && (
                        <div className='text-[#ec5555]'>{formik.errors.salaryFrom}</div>
                      )}
                    </div>
                    <div className='w-[40%]'>
                      <div>to</div>
                      <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='salaryTo' placeholder='1,000,000 VNĐ' value={formik.values.salaryTo} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '90%' }} />
                      {formik.errors.salaryTo && formik.touched.salaryTo && (
                        <div className='text-[#ec5555]'>{formik.errors.salaryTo}</div>
                      )}
                    </div>
                    <FormControlLabel
                      sx={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'end' }}
                      control={<Checkbox />} label="Negotiable" />
                  </div>

                  <div>
                    <Autocomplete
                      options={categoryData.province}
                      size={'small'}
                      sx={{ width: '100%', marginTop: '1rem' }}
                      renderInput={(params) => <TextField {...params} label="City name" />}
                      onChange={(event, value) => { formik.setFieldValue('cityName', value) }} />
                    {formik.errors.cityName && formik.touched.cityName && (
                      <div className='text-[#ec5555]'>{formik.errors.cityName}</div>
                    )}
                  </div>

                  <div>
                    <TextField label="Address" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='address' value={formik.values.address} onChange={formik.handleChange} />
                    {formik.errors.address && formik.touched.address && (
                      <div className='text-[#ec5555]'>{formik.errors.address}</div>
                    )}
                  </div>

                  <div className='mt-4'>Description</div>
                  <TextareaAutosize
                    name='description'
                    value={formik.values.description}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835' }}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.description && formik.touched.description && (
                    <div className='text-[#ec5555]'>{formik.errors.description}</div>
                  )}

                  <div className='mt-4'>Requirement</div>
                  <TextareaAutosize
                    e name='requirement'
                    value={formik.values.requirement}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835' }}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.requirement && formik.touched.requirement && (
                    <div className='text-[#ec5555]'>{formik.errors.requirement}</div>
                  )}


                  <div className='mt-4'>Benefit</div>
                  <TextareaAutosize
                    name='benefit'
                    value={formik.values.benefit}
                    minRows={2}
                    maxRows={5}
                    style={{ width: '100%', border: '1px solid #116835' }}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.benefit && formik.touched.benefit && (
                    <div className='text-[#ec5555]'>{formik.errors.benefit}</div>
                  )}

                </div>
                <div className='mt-3 flex justify-around'>
                  <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Cancel</button>
                  <button type='submit' className='btn-create'>Save</button>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  )
}

export default RecruitmentRequestPage
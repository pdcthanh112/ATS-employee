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
import { createRecruitmentRequest, getAllRecruimentRequest } from '../../../../apis/recruimentRequestApi'
import ListRecruitmentRequest from '../ListRecruitmentRequest/ListRecruitmentRequest'
import { educationLevelData, experienceData, foreignLanguageData, typeOfWorkData } from '../../../../utils/dropdownData'
import { positionName, responseStatus } from '../../../../utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllDepartment } from '../../../../apis/departmentApi'
import {  getPlanDetailApprovedByDepartment, getPlanDetailById } from '../../../../apis/planDetailApi'
import CalendarIcon from './../../../../assets/icon/calendar.png'
import ShowMoreComponent from '../../ShowMoreComponent/ShowMoreComponent'

const RecruitmentRequestPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmiting, setIsSubmitting] = useState(false)


  const [tabPage, setTabPage] = useState(0);
  const FormTitles = ["Choose plan", "Fill information"];

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: 600,
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getApprovedByDepartment(currentUser.employee.department.id, currentUser.token);
  //     if (response) {
  //       setListApprovedPlanDetail(response.data)
  //     }
  //   }
  //   fetchData();
  // }, [])

  const PageDisplay = () => {
    if (tabPage === 0) {
      return <ChoosePlanTab formik={formik} />;
    } else if (tabPage === 1) {
      return <FillInformationTab formik={formik} />;
    }
  };

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
      amount: '',
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
      name: '',
      planDetailId: '',
      positionName: '',
      requirement: '',
      salaryFrom: '',
      salaryTo: '',
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
      name: Yup.string().required('Please input job name'),
      planDetailId: Yup.string().required('Please choose recruitment plan'),
      positionName: Yup.string().required('Please choose position'),
      requirement: Yup.string().required('Please input requirement'),
      salaryFrom: Yup.string().required('Please input salary range'),
      salaryTo: Yup.string().required('Please input salary range'),
      typeOfWork: Yup.string().required('Please choose type of work'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true)
      await createRecruitmentRequest(values, currentUser.token).then(response => {     
        if (response.message.includes(' expiry date')) {
          formik.errors.expiryDate = "Invalid expiry date"
        }
        setIsSubmitting(false)
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

        {currentUser.employee.position.name === positionName.POSITION_HR && <div className='create-request hover:cursor-pointer' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
          <span className='mr-1'>Create recruitment request</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={AddIcon} alt='' /></span>
        </div>}

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

      <Modal open={openModalCreate} onClose={() => {setOpenModalCreate(false); formik.resetForm(); setTabPage(0)}}>
        <Box sx={style}>
          <div className='modalCreateRequest-container'>
            <div className='modalCreateRequest-title'>
              <span className='font-medium text-3xl mr-3 mb-3'>Create recruitment request</span>
              <img src={RequestIcon} alt='' width={'50rem'} />
            </div>
            <div className='modalCreateRequest-content'>
              <div className='bg-[#C9F7F5]'>
                <div className="progressbar" style={{ width: tabPage === 0 ? "50%" : "100%" }}></div>
              </div>
              <div className="font-medium text-xl">
                <h1>{FormTitles[tabPage]}</h1>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="modalCreateRequest-body">{PageDisplay()}</div>
                <div className="modalCreateRequest-footer">
                  {tabPage === 0 ?
                    <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#F64E60]'
                        onClick={() => { setOpenModalCreate(false) }}>Cancel</button>
                      <button type='button' className={`btn-create ${formik.values.planDetailId ? 'bg-[#1BC5BD]' : 'bg-[#c1c1c1]'}`}
                      disabled={!formik.values.planDetailId}
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div> : <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#1BC5BD]'
                        onClick={() => { setTabPage((currPage) => currPage - 1); }}>
                        Prev
                      </button>
                      <button className='btn-create bg-[#20D489]' onClick={formik.handleSubmit}>
                        Submit
                      </button>
                      {isSubmiting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
                    </div>}
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

//////////////////////////////////////////////////////////////////////////////////////////
const ChoosePlanTab = ({ formik }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listDepartment, setListDepartment] = useState([])
  const [listPlanDetail, setListPlanDetail] = useState([])
  const [currentDepartment, setCurrentDepartment] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllDepartment(currentUser.token, 0, 20);
      if (response) {
        setListDepartment(response.data.responseList)
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (currentDepartment) {   
      const fetchData = async () => {
        const response = await getPlanDetailApprovedByDepartment(currentUser.token, currentDepartment);
        if (response.data && response.data.length > 0) {
          setListPlanDetail(response.data)
        } else {
          setListPlanDetail([])
        }
      }
      fetchData();
    }
  }, [currentDepartment])

  return (
    <React.Fragment>
      <Autocomplete
        options={listDepartment}
        size={'small'}
        sx={{ width: '100%', marginTop: '1rem' }}
        getOptionLabel={option => option.name}
        renderInput={(params) => <TextField {...params} label="Department" />}
        onChange={(event, value) => { setCurrentDepartment(value.id) }} />

      <div>
        <Autocomplete
          options={listPlanDetail}
          size={'small'}
          sx={{ width: '100%', marginTop: '1rem' }}
          disabled={currentDepartment === undefined}
          getOptionLabel={option => option.name}
          renderInput={(params) => <TextField {...params} label="Plan detail" />}
          onChange={(event, value) => { formik.setFieldValue('planDetailId', value.id) }} />
        {formik.errors.planDetailId && formik.touched.planDetailId && (
          <div className='text-[#ec5555]'>{formik.errors.planDetailId}</div>
        )}
      </div>

      {formik.values.planDetailId && <ShowPlanDetailData planDetailId={formik.values.planDetailId} />}
    
    </React.Fragment>
  );
}


const FillInformationTab = ({ formik }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);
  const [isLoading, setIsLoading] = useState(true)
  const [isSalaryNegotiable, setIsSalaryNegotiable] = useState(false)

  const [planDetailData, setPlanDetailData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getPlanDetailById(currentUser.token, formik.values.planDetailId);
      if (response) {
        setPlanDetailData(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [formik.values.planDetailId])

  useEffect(() => {
    if (isSalaryNegotiable) {
      formik.values.salaryFrom = 'Negotiable'
      formik.values.salaryTo = 'Negotiable'
    } else {
      formik.values.salaryFrom = ''
      formik.values.salaryTo = ''
    }
  }, [isSalaryNegotiable])

  if (!isLoading) {
    formik.values.amount = planDetailData.amount
    formik.values.positionName = planDetailData.position.name
  }

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div>
           <div>
              <TextField label="Recruitment name" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='name' value={formik.values.name} onChange={formik.handleChange} />
              {formik.errors.name && formik.touched.name && (
                <div className='text-[#ec5555]'>{formik.errors.name}</div>
              )}
            </div>

          <div className='grid grid-cols-2 px-1'>
            <TextField label="Position" variant="outlined" size='small' sx={{ marginTop: '1rem', width: '85%' }} name='positionName' value={formik.values.positionName} disabled />

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
                sx={{ width: '85%', marginTop: '1rem' }}
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
                sx={{ width: '85%', marginTop: '1rem' }}
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
                sx={{ width: '85%', marginTop: '1rem' }}
                renderInput={(params) => <TextField {...params} label="Industry" />}
                onInputChange={(event, value) => { formik.setFieldValue('industry', value) }} />
              {formik.errors.industry && formik.touched.industry && (
                <div className='text-[#ec5555]'>{formik.errors.industry}</div>
              )}
            </div>
            <div>
              <TextField label="Amount" variant="outlined" size='small' sx={{ marginTop: '1rem', width: '100%' }} name='amount' value={formik.values.amount} disabled />
              {formik.errors.amount && formik.touched.amount && (
                <div className='text-[#ec5555]'>{formik.errors.amount}</div>
              )}
            </div>
          </div>


          <div className='mt-3 ml-14 font-semibold'>Expired date</div>
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
              <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='salaryFrom' placeholder='1,000,000 VNĐ' value={formik.values.salaryFrom} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '90%' }} disabled={isSalaryNegotiable} />
              {formik.errors.salaryFrom && formik.touched.salaryFrom && (
                <div className='text-[#ec5555]'>{formik.errors.salaryFrom}</div>
              )}
            </div>
            <div className='w-[40%]'>
              <div>to</div>
              <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='salaryTo' placeholder='1,000,000 VNĐ' value={formik.values.salaryTo} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '90%' }} disabled={isSalaryNegotiable} />
              {formik.errors.salaryTo && formik.touched.salaryTo && (
                <div className='text-[#ec5555]'>{formik.errors.salaryTo}</div>
              )}
            </div>
            <FormControlLabel
              sx={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'end' }}
              control={<Checkbox onChange={(event) => setIsSalaryNegotiable(event.target.checked)} />} label="Negotiable" />
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
            style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
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
            style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
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
            style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
            onChange={formik.handleChange}
          />
          {formik.errors.benefit && formik.touched.benefit && (
            <div className='text-[#ec5555]'>{formik.errors.benefit}</div>
          )}
        </div>
      }
    </React.Fragment>
  );
}


const ShowPlanDetailData = ({ planDetailId }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [planDatailData, setPlanDetailData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getPlanDetailById(currentUser.token, planDetailId);
      if (response.data) {
        setPlanDetailData(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [planDetailId])

  if (isLoading) return

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <div className='mt-3 rounded-lg' style={{ border: '1px solid #000', padding: '1rem 2rem' }}>
        <div>
          <div className='font-semibold text-xl'>Period</div>
          <div className='grid grid-cols-2 px-1'>
            <div>
              <div className='font-medium text-base'>from</div>
              <div className='item-value w-[80%] justify-between'>{planDatailData.periodFrom}<img src={CalendarIcon} alt='' width={'18rem'} /></div>
            </div>
            <div>
              <div className='font-medium text-base'>to</div>
              <div className='item-value w-[80%] justify-between'>{planDatailData.periodTo}<img src={CalendarIcon} alt='' width={'18rem'} /></div>
            </div>
          </div>
          <div className='grid grid-cols-2 mt-3'>
            <div>
              <div className='font-semibold text-xl mb-1'>Amount</div>
              <div className='item-value w-[60%] justify-center ml-5'>{planDatailData.amount}</div>
            </div>
            <div>
              <div className='font-semibold text-xl mb-1'>Salary</div>
              <div className='item-value w-[85%]'>{planDatailData.salary}</div>
            </div>
          </div>
        </div>
        <div className='mt-2 pl-5'>
          <div><ShowMoreComponent title='Reason' content={planDatailData.reason} /></div>
          <div><ShowMoreComponent title='Description' content={planDatailData.description} /></div>
          <div><ShowMoreComponent title='Requirment' content={planDatailData.requirement} /></div>
          <div><ShowMoreComponent title='Note' content={planDatailData.note} /></div>
        </div>
      </div>}
    </React.Fragment>
  );
}

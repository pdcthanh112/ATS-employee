import React, { useEffect, useState } from 'react'
import './InterviewPage.scss'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading'
import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import { getAllInterview } from '../../../apis/interviewApi';
import InterviewIcon from '../../../assets/icon/calendar.png'
import SearchIcon from '../../../assets/icon/filter.png'
import AddIcon from '../../../assets/icon/plus.png'
import ListInterviewSchedule from '../ListInterview/ListInterview';
import { positionName } from '../../../utils/constants';
import { getAllDepartment } from '../../../apis/departmentApi';
import { getCandidateAppliedByRecruitmentRequest, getListRecruimentRequestByDepartment, getRecruimentRequestById } from '../../../apis/recruimentRequestApi';


const InterviewPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listInterviewSchedule, setListInterviewSchedule] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [tabPage, setTabPage] = useState(0);
  const FormTitles = ["Choose recruitment request", "Choose paticipants", "Fill information"];

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getAllInterview(currentUser.token, pagination.currentPage - 1, 4);
      if (response) {
        setListInterviewSchedule(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getAllInterview(currentUser.token, pagination.currentPage - 1, 4);
      if (response) {
        setListInterviewSchedule(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  const PageDisplay = () => {
    if (tabPage === 0) {
      return <ChooseRecruitmentRequestTab formik={formik} />;
    } else if (tabPage === 1) {
      return <ChoosePaticipantsTab formik={formik} />;
    } else if (tabPage === 2) {
      return <FillInformationTab formik={formik} />;
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true)
  //     const response = await getAllInterview(currentUser.token, pagination.currentPage - 1, 4);
  //     if (response) {
  //       console.log(response.data);
  //       setListInterviewSchedule(response.data.responseList)
  //       setPagination({ ...pagination, totalPage: response.data.totalPage })
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchData();
  // }, [pagination.currentPage])

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
      candidateId: '',
      date: '',
      description: '',
      employeeId: [],
      linkMeeting: '',
      purpose: '',
      recruitmentRequestId: '',
      room: '',
      round: '',
      subject: '',
      time: '',
      type: ''
    },
    validationSchema: Yup.object({

    }),
    onSubmit: (values) => {
      console.log(values);
      // setIsLoading(true)
      // createRecruitmentPlan(currentUser.token, values).then((response) => {
      //   response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      // }).then(setIsLoading(false))
    }
  })

  return (
    <React.Fragment>
      <div className='interview-container'>
        <div className='flex px-8 pt-8'>
          <span className='font-medium text-3xl mr-3'>Interview</span>
          <img src={InterviewIcon} alt='' width={'30rem'} />
        </div>

        {currentUser.employee.position.name === positionName.POSITION_HR && <div className='create-schedule' onClick={() => setOpenModalCreate(true)} title='Create a new interview'>
          <span className='mr-1'>Create an interview</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={AddIcon} alt='' /></span>
        </div>}

        <div className='filter-container'>
          <div className='inputName'>
            <input type={'text'} className='form-control' placeholder='Nhập tên ứng viên...' onChange={(event) => { handleChangeSearchObject('name', event.target.value) }} />
          </div>

          <Autocomplete
            blurOnSelect={true}
            //options={typeOfWorkData()}
            size={'small'}
            sx={{ width: 170, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Loại công việc" />}
            onChange={(event, value) => { handleChangeSearchObject('typeOfWork', value.value) }} />

          <div className='mr-5'>
            <input type={'date'} className='form-control' onChange={(event) => { handleChangeSearchObject('fromDate', event.target.value) }} />
          </div>

          <div className='mr-5'>
            <input type={'date'} className='form-control' onChange={(event) => { handleChangeSearchObject('toDate', event.target.value) }} />
          </div>

          <img src={SearchIcon} alt="" width={'50rem'} title='Search' onClick={() => onHandleSearch()} />
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListInterviewSchedule listInterviewSchedule={listInterviewSchedule} />}

        <div className='pagination-container'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='flex'>
              <span className='font-medium text-3xl mr-3'>Create intervieww</span>
              <img src={InterviewIcon} alt='' width={'30rem'} />
            </div>
            <div className='modalCreateInterview-content'>
              <div className='bg-[#C9F7F5]'>
                <div className="progressbar" style={{ width: tabPage === 0 ? "33%" : tabPage === 1 ? "67%" : "100%" }}></div>
              </div>
              <div className="font-medium text-xl">
                <h1>{FormTitles[tabPage]}</h1>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="modalCreateInterview-body">{PageDisplay()}</div>
                <div className="modalCreateInterview-footer">
                  {tabPage === 0 &&
                    <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#F64E60]'
                        onClick={() => { setOpenModalCreate(false) }}>Cancel</button>
                      <button type='button' className='btn-create bg-[#1BC5BD]'
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div>}
                  {tabPage === 1 &&
                    <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#F64E60]'
                        onClick={(e) => { setTabPage((currPage) => currPage - 1); e.preventDefault() }}>Prev</button>
                      <button type='button' className='btn-create bg-[#1BC5BD]'
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div>}
                  {tabPage === 2 && <div className='flex justify-evenly mt-5'>
                    <button type='button' className='btn-create bg-[#1BC5BD]' disabled={tabPage === 0}
                      onClick={(e) => { setTabPage((currPage) => currPage - 1); e.preventDefault() }}>
                      Prev
                    </button>
                    <button className='btn-create bg-[#20D489]' onClick={formik.handleSubmit}>
                      Submit
                    </button>
                  </div>}
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default InterviewPage


const ChooseRecruitmentRequestTab = ({ formik }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listDepartment, setListDepartment] = useState([])
  const [currentDepartment, setCurrentDepartment] = useState()
  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])

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
        const response = await getListRecruimentRequestByDepartment(currentUser.token, currentDepartment);
        if (response.data && response.data.length > 0) {
          setListRecruitmentRequest(response.data)
        } else {
          setListRecruitmentRequest([])
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
          options={listRecruitmentRequest}
          size={'small'}
          sx={{ width: '100%', marginTop: '1rem' }}
          disabled={currentDepartment === undefined}
          getOptionLabel={option => option.name}
          renderInput={(params) => <TextField {...params} label="Recruitment request" />}
          onChange={(event, value) => { formik.setFieldValue('recruitmentRequestId', value.id) }} />
        {formik.errors.recruitmentRequestId && formik.touched.recruitmentRequestId && (
          <div className='text-[#ec5555]'>{formik.errors.recruitmentRequestId}</div>
        )}
      </div>

      {formik.values.recruitmentRequestId && <ShowRecruitmentRequestDetail id={formik.values.recruitmentRequestId} />}

    </React.Fragment>
  );
}


const ChoosePaticipantsTab = ({ formik }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);
  const [isLoading, setIsLoading] = useState(true)
  const [listEmployee, setListEmployee] = useState([])
  const [listCandidate, setListCandidate] = useState([])
  console.log('asfasdf', formik.values.recruitmentRequestId);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getCandidateAppliedByRecruitmentRequest(currentUser.token, formik.values.recruitmentRequestId);
      if (response) {
        setListCandidate(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [formik.values.recruitmentRequestId])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getCandidateAppliedByRecruitmentRequest(currentUser.token, formik.values.recruitmentRequestId);
      if (response) {
        setListCandidate(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [formik.values.recruitmentRequestId])



  return (
    <React.Fragment>

      <div>


        <div>
          <Autocomplete
            options={listCandidate}
            size={'small'}
            sx={{ width: '85%', marginTop: '1rem' }}
            getOptionLabel={option => option.name}
            renderInput={(params) => <TextField {...params} label="Candidate" />}
            onChange={(event, value) => { formik.setFieldValue('candidateId', value.id) }} />
          {formik.errors.industry && formik.touched.industry && (
            <div className='text-[#ec5555]'>{formik.errors.industry}</div>
          )}
        </div>

        <div>
          <Autocomplete
            multiple
            options={categoryData.industry}
            size={'small'}
            sx={{ width: '85%', marginTop: '1rem' }}
            renderInput={(params) => <TextField {...params} label="Employee" />}
            onChange={(event, value) => { console.log('industry', value) }}
          // onInputChange={(event, value) => { formik.setFieldValue('industry', value) }} 
          />
          {formik.errors.industry && formik.touched.industry && (
            <div className='text-[#ec5555]'>{formik.errors.industry}</div>
          )}
        </div>

      </div>



    </React.Fragment>
  );
}

const FillInformationTab = ({ formik }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);
  const [isLoading, setIsLoading] = useState(true)

  const [planDetailData, setPlanDetailData] = useState({})

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true)
  //     const response = await getPlanDetailById(currentUser.token, formik.values.planDetailId);
  //     if (response) {
  //       setPlanDetailData(response.data)
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchData();
  // }, [formik.values.planDetailId])



  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div>
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



          <div className='mt-4'>Benefit</div>

        </div>
      }
    </React.Fragment>
  );
}

const ShowRecruitmentRequestDetail = (id) => {

  const [recruitmentRequestData, setRecruitmentRequestData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getRecruimentRequestById(id.id);
      if (response.data) {
        setRecruitmentRequestData(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [id])

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div className='mt-3 rounded-lg' style={{ border: '1px solid #000', padding: '1rem 2rem' }}>
          <div className='font-medium'>Name</div>
          <div className='info-tag'>{recruitmentRequestData.name}</div>
          <div className='grid grid-cols-2 mt-2'>
            <div className='w-[90%]'>
              <div className='font-medium'>Position</div>
              <div className='info-tag'>{recruitmentRequestData.position.name}</div>
            </div>
            <div>
              <div className='font-medium'>Level</div>
              <div><div className='info-tag'>{recruitmentRequestData.jobLevel}</div></div>
            </div>
          </div>
          <div className='grid grid-cols-2 mt-2'>
            <div className='w-[90%]'>
              <div className='font-medium'>Industry</div>
              <div className='info-tag'>{recruitmentRequestData.industry}</div>
            </div>
            <div>
              <div className='font-medium'>Type of work</div>
              <div className='info-tag'>{recruitmentRequestData.typeOfWork}</div>
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  )
}
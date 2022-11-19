import React, { useEffect, useState } from 'react'
import './InterviewSchedulePage.scss'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { Box, Modal, Pagination, Stack, TextField, Autocomplete, TextareaAutosize, Switch, FormControlLabel } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createInterview, getAllInterview } from '../../../../apis/interviewScheduleApi';
import InterviewIcon from '../../../../assets/icon/calendar.png'
import SearchIcon from '../../../../assets/icon/filter.png'
import AddIcon from '../../../../assets/icon/plus.png'
import ListInterviewSchedule from '../ListInterviewSchedule/ListInterviewSchedule';
import { interviewType, positionName, responseStatus } from '../../../../utils/constants';
import { getAllDepartment } from '../../../../apis/departmentApi';
import { getListRecruimentRequestByDepartment, getRecruimentRequestById } from '../../../../apis/recruimentRequestApi';
import { getCandidateAppliedByRecruitmentRequest } from '../../../../apis/candidateApi';
import { getEmployeeByRecruitmentRequest } from '../../../../apis/employeeApi';
import { interviewRound } from '../../../../utils/dropdownData';

const InterviewPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listInterviewSchedule, setListInterviewSchedule] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmiting, setIsSubmitting] = useState(false)

  const [tabPage, setTabPage] = useState(0);
  const FormTitles = ["Choose recruitment request", "Choose paticipants", "Fill information"];

  const style = {
    position: 'absolute',
    top: '20rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: 600,
    overflow: 'scroll',
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true)
  //     const response = await getAllInterview(currentUser.token, pagination.currentPage - 1, 4);
  //     if (response) {
  //       setListInterviewSchedule(response.data.responseList)
  //       setPagination({ ...pagination, totalPage: response.data.totalPage })
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchData();
  // }, [])

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
      //address: Yup.string().required('Please input address'),
      candidateId: Yup.string().required('Please choose candidate'),
      date: Yup.string().required('Please input date'),
      description: Yup.string().required('Please input description'),
      employeeId: Yup.array().min(1, 'Please choose at least 1 employee interview'),
      //linkMeeting: Yup.string().required('Please input link meeting'),
      purpose: Yup.string().required('Please input purpose'),
      recruitmentRequestId: Yup.string().required('Please input address'),
      //room: Yup.string().required('Please input room'),
      round: Yup.string().required('Please choose round'),
      subject: Yup.string().required('Please input subject'),
      time: Yup.string().required('Please input time'),
      //type: Yup.string().required('Please choose type of interview'),
    }),
    onSubmit: async (values) => {
      console.log('values', values);
      setIsSubmitting(true)
      await createInterview(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      })
      setIsSubmitting(false)
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

      <Modal open={openModalCreate} onClose={() => { setOpenModalCreate(false); formik.resetForm(); setTabPage(0) }}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='flex'>
              <span className='font-medium text-3xl mr-3'>Create interview</span>
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
                      <button type='button' className={`btn-create ${formik.values.recruitmentRequestId ? 'bg-[#1BC5BD]' : 'bg-[#c1c1c1]'}`}
                        disabled={!formik.values.recruitmentRequestId}
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div>}
                  {tabPage === 1 &&
                    <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#F64E60]'
                        onClick={(e) => { setTabPage((currPage) => currPage - 1); e.preventDefault() }}>Prev</button>
                      <button type='button' className={`btn-create ${!formik.values.candidateId || formik.values.employeeId.length === 0 ? 'bg-[#C1C1C1]' : 'bg-[#1BC5BD]'}`}
                        disabled={!formik.values.candidateId || formik.values.employeeId.length === 0}
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div>}
                  {tabPage === 2 && <div className='flex justify-evenly mt-5'>
                    <button type='button' className='btn-create bg-[#1BC5BD]'
                      onClick={(e) => { setTabPage((currPage) => currPage - 1); e.preventDefault() }}>
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

  const [isLoading, setIsLoading] = useState(true)
  const [listEmployee, setListEmployee] = useState([])
  const [listCandidate, setListCandidate] = useState([])
  const [listEmpInterview, setListEmpInterview] = useState([])

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
      const response = await getEmployeeByRecruitmentRequest(currentUser.token, formik.values.recruitmentRequestId);
      if (response) {
        setListEmployee(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [formik.values.recruitmentRequestId])

  useEffect(() => {
    const listTmp = []
    if (listEmpInterview) {
      listEmpInterview.map(item => listTmp.push(item.id))
    }
    if (listTmp && listTmp.length > 0) {
      formik.setFieldValue('employeeId', listTmp)
    }
  }, [listEmpInterview])

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
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
              options={listEmployee}
              size={'small'}
              sx={{ width: '85%', marginTop: '1rem' }}
              getOptionLabel={option => option.name}
              renderInput={(params) => <TextField {...params} label="Employee" />}
              onChange={(event, value) => { setListEmpInterview(value) }} />
            {formik.errors.employeeId && formik.touched.employeeId && (
              <div className='text-[#ec5555]'>{formik.errors.employeeId}</div>
            )}
          </div>
        </div>
      }
    </React.Fragment>
  );
}

const FillInformationTab = ({ formik }) => {

  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (isOnline) {
      formik.values.type = interviewType.ONLINE
      formik.values.address = ''
      formik.values.room = ''
    } else {
      formik.values.type = interviewType.OFFLINE
      formik.values.linkMeeting = ''
    }
  }, [isOnline])

  return (
    <div>
      <div className='w-full flex mt-3'>
        <div className='w-[22%] mr-3'>
          <Autocomplete
            options={interviewRound()}
            size={'small'}
            sx={{ width: '100%', marginRight: '2rem' }}
            renderInput={(params) => <TextField {...params} label="Round" />}
            onChange={(event, value) => { formik.setFieldValue('round', value) }} />
          {formik.errors.round && formik.touched.round && (
            <div className='text-[#ec5555]'>{formik.errors.round}</div>
          )}
        </div>
        <div className='w-[100%]'>
          <TextField label='Subject' variant="outlined" size='small' style={{ width: '100%' }} name='subject' value={formik.values.subject} onChange={formik.handleChange} />
          {formik.errors.subject && formik.touched.subject && (
            <div className='text-[#ec5555]'>{formik.errors.subject}</div>
          )}
        </div>
      </div>
      <div className='flex justify-evenly mt-3'>
        <div>
          <TextField type={'date'} variant="outlined" size='small' style={{ width: '100%' }} name='date' value={formik.values.date} onChange={formik.handleChange} />
          {formik.errors.date && formik.touched.date && (
            <div className='text-[#ec5555]'>{formik.errors.date}</div>
          )}
        </div>
        <div>
          <TextField type={'time'} variant="outlined" size='small' style={{ width: '100%' }} name='time' value={formik.values.time} onChange={formik.handleChange} />
          {formik.errors.time && formik.touched.time && (
            <div className='text-[#ec5555]'>{formik.errors.time}</div>
          )}
        </div>
      </div>

      <div className='mt-4'>Purpose</div>
      <TextareaAutosize
        name='purpose'
        value={formik.values.purpose}
        minRows={2}
        maxRows={5}
        style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
        onChange={formik.handleChange}
      />
      {formik.errors.purpose && formik.touched.purpose && (
        <div className='text-[#ec5555]'>{formik.errors.purpose}</div>
      )}

      <FormControlLabel control={<Switch onChange={(event) => setIsOnline(event.target.checked)} />} label={isOnline ? 'Online' : 'Offline'} />

      {isOnline ? <div>
        <TextField label='Google meet' variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='linkMeeting' value={formik.values.linkMeeting} onChange={formik.handleChange} />
      </div> : <div>
        <div>
          <TextField label='Room' variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='room' value={formik.values.room} onChange={formik.handleChange} />
          {formik.errors.room && formik.touched.room && (
            <div className='text-[#ec5555]'>{formik.errors.room}</div>
          )}
        </div>
        <div>
          <TextField label='Address' variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='address' value={formik.values.address} onChange={formik.handleChange} />
          {formik.errors.address && formik.touched.address && (
            <div className='text-[#ec5555]'>{formik.errors.address}</div>
          )}
        </div>
      </div>}

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
    </div>
  );
}

const ShowRecruitmentRequestDetail = ({ id }) => {

  const [recruitmentRequestData, setRecruitmentRequestData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getRecruimentRequestById(id);
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
              <div className='font-medium'>Create date</div>
              <div className='info-tag'>{recruitmentRequestData.date}</div>
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
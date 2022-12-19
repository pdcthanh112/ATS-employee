import React, { useEffect, useState } from 'react'
import './InterviewSchedulePage.scss'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Autocomplete, Box, FormControlLabel, Modal, Pagination, Stack, Switch, TextareaAutosize, TextField } from '@mui/material'
import ReactLoading from 'react-loading'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getCandidateAppliedByRecruitmentRequest } from '../../../../apis/candidateApi'
import { getIdAndNameActiveDepartment } from '../../../../apis/departmentApi'
import { getEmployeeByRecruitmentRequest } from '../../../../apis/employeeApi'
import { getAllInterview, getInterviewByEmployee } from '../../../../apis/interviewScheduleApi'
import { getListRecruimentRequestByDepartment, getRecruimentRequestById } from '../../../../apis/recruimentRequestApi'
import InterviewIcon from '../../../../assets/icon/calendar.png'
import DepartmentInterviewIcon from '../../../../assets/icon/department-interview.png'
import SearchIcon from '../../../../assets/icon/filter.png'
import AddIcon from '../../../../assets/icon/plus.png'
import { departmentName, interviewType, jobLevelName } from '../../../../utils/constants'
import { durationData, interviewRoundData, interviewStatusData, interviewTypeData } from '../../../../utils/dropdownData'
import { useCreateInterviewSchedule } from '../hooks/interviewScheduleHook'
import ListInterviewSchedule from '../ListInterviewSchedule/ListInterviewSchedule'

const InterviewPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isSubmiting, setIsSubmitting] = useState(false)

  const { mutate: createInterviewSchedule } = useCreateInterviewSchedule();
  //const { mutate: searchInterviewSchedule } = useSearchInterviewSchedule();

  const [tabPage, setTabPage] = useState(0);
  const FormTitles = ["Choose recruitment request", "Choose paticipants", "Fill information"];

  const style = {
    position: 'absolute',
    top: '20rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: 600,
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const { data: listInterviewSchedule, isLoading } = useQuery(['listInterviewSchedule', pagination], async () => currentUser.employee.department.id === departmentName.HR_DEPARTMENT ?
    await getAllInterview(pagination.currentPage - 1, 10).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    })
    :
    await getInterviewByEmployee(currentUser.employee.id, pagination.currentPage - 1, 10).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    }))

  const PageDisplay = () => {
    if (tabPage === 0) {
      return <ChooseRecruitmentRequestTab formikCreate={formikCreate} />;
    } else if (tabPage === 1) {
      return <ChoosePaticipantsTab formikCreate={formikCreate} />;
    } else if (tabPage === 2) {
      return <FillInformationTab formikCreate={formikCreate} />;
    }
  };

  const formikCreate = useFormik({
    initialValues: {
      address: '',
      candidateId: [],
      date: '',
      description: '',
      duration: '',
      employeeId: [],
      linkMeeting: '',
      purpose: '',
      recruitmentRequestId: '',
      room: '',
      round: 1,
      subject: '',
      time: '',
      type: ''
    },
    validationSchema: Yup.object({
      //address: Yup.string().required('Please input address'),
      candidateId: Yup.array().min(1, 'Please choose at least 1 candidate'),
      date: Yup.string().required('Please input date'),
      description: Yup.string().required('Please input description'),
      duration: Yup.string().required('Please choose duration'),
      employeeId: Yup.array().min(1, 'Please choose at least 1 employee interview'),
      //linkMeeting: Yup.string().required('Please input link meeting'),
      purpose: Yup.string().required('Please input purpose'),
      recruitmentRequestId: Yup.string().required('Please input address'),
      //room: Yup.string().required('Please input room'),
      round: Yup.string().required('Please choose round'),
      subject: Yup.string().required('Please input subject'),
      time: Yup.string().required('Please input time'),
      // //type: Yup.string().required('Please choose type of interview'),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true)
      try {
        createInterviewSchedule(values, {
          onSuccess: () => {
            toast.success('Create successfully')
            setOpenModalCreate(false)
          },
          onError: (error) => {
            if (error) {
              if (error.message.includes('pass')) formikCreate.errors.date = error.message
            }
            toast.error('Create fail')
          },
          onSettled: () => {
            setIsSubmitting(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  const formikSearch = useFormik({
    initialValues: {
      name: '',
      date: '',
      round: '',
      type: '',
      status: ''
    },
    onSubmit: (values) => {
      // listInterviewSchedule = useQuery('searchInterviewSchedule', () => searchInterviewSchedule(values).then(res => console.log(res)))
    }
  })

  return (
    <React.Fragment>
      <div className='interviewSchedule-container'>
        <div className='flex px-8 pt-8'>
          <span className='font-medium text-3xl mr-3'>Interview schedule</span>
          <img src={InterviewIcon} alt='' width={'30rem'} />
        </div>

        {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <div className='create-schedule hover:cursor-pointer' onClick={() => setOpenModalCreate(true)} title='Create a new interview'>
          <span className='mr-1'>Create an interview</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={AddIcon} alt='' /></span>
        </div>}

        {currentUser.employee.jobLevel === jobLevelName.MANAGER || currentUser.employee.jobLevel === jobLevelName.DIRECTOR ?
          <div className='flex justify-end mr-20 '>
            <Link to={`/department-interview/${currentUser.employee.department.id}`} target="_blank" className='text-[#FFF] text-lg ml-2 hover:text-[#FFF]'>
              <div className='bg-[#1DAF5A] flex px-3 py-2 rounded-md hover:cursor-pointer'>
                <img src={DepartmentInterviewIcon} alt="" width={'30rem'} />
                <span>View department interview</span>
              </div>
            </Link>
          </div> : <></>
        }

        <div className='filter-container'>
          <div className='inputName'>
            <input type={'text'} className='form-control bg-[#f8f9fa]' placeholder='Candidate name...' name='name' value={formikSearch.values.name} onChange={formikSearch.handleChange} />
          </div>

          <div className='mr-5'>
            <input type={'date'} className='form-control bg-[#f8f9fa]' name='date' value={formikSearch.values.date} onChange={formikSearch.handleChange} />
          </div>

          <Autocomplete
            options={interviewRoundData()}
            size={'small'}
            sx={{ width: 120, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Round" />}
            onInputChange={(event, value) => { formikSearch.setFieldValue('round', value) }}
          />

          <Autocomplete
            options={interviewTypeData()}
            size={'small'}
            sx={{ width: 170, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Type" />}
            onInputChange={(event, value) => { formikSearch.setFieldValue('type', value.toUpperCase()) }}
          />

          <Autocomplete
            options={interviewStatusData()}
            size={'small'}
            sx={{ width: 170, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Status" />}
            onInputChange={(event, value) => { formikSearch.setFieldValue('status', value.toUpperCase()) }}
          />

          <img src={SearchIcon} alt="" style={{ width: '2.5rem', height: '2.5rem' }} title='Search' className='hover:cursor-pointer' onClick={formikSearch.handleSubmit} />
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListInterviewSchedule listInterviewSchedule={listInterviewSchedule} currPage={pagination.currentPage} />}

        <div className='flex justify-center'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>

      <Modal open={openModalCreate} onClose={() => { setOpenModalCreate(false); formikCreate.resetForm(); setTabPage(0) }}>
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
              <form onSubmit={formikCreate.handleSubmit}>
                <div className="modalCreateInterview-body">{PageDisplay()}</div>
                <div className="modalCreateInterview-footer">
                  {tabPage === 0 &&
                    <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#F64E60]'
                        onClick={() => { setOpenModalCreate(false) }}>Cancel</button>
                      <button type='button' className={`btn-create ${formikCreate.values.recruitmentRequestId ? 'bg-[#1BC5BD]' : 'bg-[#c1c1c1]'}`}
                        disabled={!formikCreate.values.recruitmentRequestId}
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div>}
                  {tabPage === 1 &&
                    <div className='flex justify-evenly mt-5'>
                      <button type='button' className='btn-create bg-[#F64E60]'
                        onClick={(e) => { setTabPage((currPage) => currPage - 1); e.preventDefault() }}>Prev</button>
                      <button type='button' className={`btn-create ${formikCreate.values.candidateId.length === 0 || formikCreate.values.employeeId.length === 0 ? 'bg-[#C1C1C1]' : 'bg-[#1BC5BD]'}`}
                        disabled={formikCreate.values.candidateId.length === 0 || formikCreate.values.employeeId.length === 0}
                        onClick={(e) => { setTabPage((currPage) => currPage + 1); e.preventDefault() }}>
                        Next
                      </button>
                    </div>}
                  {tabPage === 2 && <div className='flex justify-evenly mt-5'>
                    <button type='button' className='btn-create bg-[#1BC5BD]'
                      onClick={(e) => { setTabPage((currPage) => currPage - 1); e.preventDefault() }}>
                      Prev
                    </button>
                    <button className='btn-create bg-[#20D489]' onClick={formikCreate.handleSubmit}>
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


const ChooseRecruitmentRequestTab = ({ formikCreate }) => {

  const [listDepartment, setListDepartment] = useState([])
  const [currentDepartment, setCurrentDepartment] = useState()
  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getIdAndNameActiveDepartment();
      if (response) {
        setListDepartment(response.data)
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (currentDepartment) {
      const fetchData = async () => {
        const response = await getListRecruimentRequestByDepartment(currentDepartment);
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
        onChange={(event, value) => { setCurrentDepartment(value.id) }}
      />

      <div>
        <Autocomplete
          options={listRecruitmentRequest}
          size={'small'}
          sx={{ width: '100%', marginTop: '1rem' }}
          disabled={currentDepartment === undefined}
          getOptionLabel={option => option.name}
          renderInput={(params) => <TextField {...params} label="Job request" />}
          onChange={(event, value) => { formikCreate.setFieldValue('recruitmentRequestId', value.id) }}
        />
        {formikCreate.errors.recruitmentRequestId && formikCreate.touched.recruitmentRequestId && (
          <div className='text-[#ec5555]'>{formikCreate.errors.recruitmentRequestId}</div>
        )}
      </div>

      {formikCreate.values.recruitmentRequestId && <ShowRecruitmentRequestDetail id={formikCreate.values.recruitmentRequestId} />}

    </React.Fragment>
  );
}


const ChoosePaticipantsTab = ({ formikCreate }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [listEmployee, setListEmployee] = useState([])
  const [listCandidate, setListCandidate] = useState([])
  const [listCandidateInterview, setListCandidateInterview] = useState([])
  const [listEmpInterview, setListEmpInterview] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getCandidateAppliedByRecruitmentRequest(formikCreate.values.recruitmentRequestId);
      if (response) {
        setListCandidate(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [formikCreate.values.recruitmentRequestId])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getEmployeeByRecruitmentRequest(formikCreate.values.recruitmentRequestId);
      if (response) {
        setListEmployee(response.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [formikCreate.values.recruitmentRequestId])

  useEffect(() => {
    const listTmp = []
    if (listCandidateInterview) {
      listCandidateInterview.map(item => listTmp.push(item.id))
    }
    if (listTmp && listTmp.length > 0) {
      formikCreate.setFieldValue('candidateId', listTmp)
    }
  }, [listCandidateInterview])

  useEffect(() => {
    const listTmp = []
    if (listEmpInterview) {
      listEmpInterview.map(item => listTmp.push(item.id))
    }
    if (listTmp && listTmp.length > 0) {
      formikCreate.setFieldValue('employeeId', listTmp)
    }
  }, [listEmpInterview])

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div>
          <div>
            <Autocomplete
              multiple
              options={listCandidate}
              size={'small'}
              sx={{ width: '95%', marginTop: '1rem' }}
              getOptionLabel={option => option.name}
              renderInput={(params) => <TextField {...params} label="Choose candidate" />}
              onChange={(event, value) => { setListCandidateInterview(value) }}
            />
            {formikCreate.errors.industry && formikCreate.touched.industry && (
              <div className='text-[#ec5555]'>{formikCreate.errors.industry}</div>
            )}
          </div>

          <div>
            <Autocomplete
              multiple
              options={listEmployee}
              size={'small'}
              sx={{ width: '95%', marginTop: '1rem' }}
              getOptionLabel={option => option.name}
              renderInput={(params) => <TextField {...params} label="Choose employee" />}
              onChange={(event, value) => { setListEmpInterview(value) }}
            />
            {formikCreate.errors.employeeId && formikCreate.touched.employeeId && (
              <div className='text-[#ec5555]'>{formikCreate.errors.employeeId}</div>
            )}
          </div>
        </div>
      }
    </React.Fragment>
  );
}

const FillInformationTab = ({ formikCreate }) => {

  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (isOnline) {
      formikCreate.values.type = interviewType.ONLINE
      formikCreate.values.address = ''
      formikCreate.values.room = ''
    } else {
      formikCreate.values.type = interviewType.OFFLINE
      formikCreate.values.linkMeeting = ''
    }
  }, [isOnline])

  return (
    <div>
      <div className='w-full flex mt-3'>
        <div className='w-[22%] mr-3'>
          <TextField
            label='Round'
            name='round'
            variant="outlined"
            size='small'
            style={{ width: '100%' }}
            value={formikCreate.values.round}
            disabled
          />
        </div>
        <div className='w-[100%]'>
          <TextField
            label='Subject'
            name='subject'
            variant="outlined"
            size='small'
            style={{ width: '100%' }}
            value={formikCreate.values.subject}
            onChange={formikCreate.handleChange}
          />
          {formikCreate.errors.subject && formikCreate.touched.subject && (
            <div className='text-[#ec5555]'>{formikCreate.errors.subject}</div>
          )}
        </div>
      </div>
      <div className='flex justify-evenly mt-3'>
        <div>
          <TextField
            type={'date'}
            name='date'
            variant="outlined"
            size='small'
            style={{ width: '100%' }}
            value={formikCreate.values.date}
            onChange={formikCreate.handleChange}
          />
          {formikCreate.errors.date && formikCreate.touched.date && (
            <div className='text-[#ec5555]'>{formikCreate.errors.date}</div>
          )}
        </div>
        <div>
          <TextField
            type={'time'}
            name='time'
            variant="outlined"
            size='small'
            style={{ width: '100%' }}
            value={formikCreate.values.time}
            onChange={formikCreate.handleChange}
          />
          {formikCreate.errors.time && formikCreate.touched.time && (
            <div className='text-[#ec5555]'>{formikCreate.errors.time}</div>
          )}
        </div>
      </div>

      <Autocomplete
        options={durationData()}
        size={'small'}
        sx={{ width: '100%', marginTop: '1rem' }}
        getOptionLabel={option => option.title}
        renderInput={(params) => <TextField {...params} label="Duration" />}
        onChange={(event, value) => { formikCreate.setFieldValue('duration', value.value) }}
      />
      {formikCreate.errors.duration && formikCreate.touched.duration && (
        <div className='text-[#ec5555]'>{formikCreate.errors.duration}</div>
      )}

      <div className='mt-4'>Purpose</div>
      <TextareaAutosize
        name='purpose'
        value={formikCreate.values.purpose}
        minRows={2}
        maxRows={5}
        style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
        onChange={formikCreate.handleChange}
      />
      {formikCreate.errors.purpose && formikCreate.touched.purpose && (
        <div className='text-[#ec5555]'>{formikCreate.errors.purpose}</div>
      )}

      <FormControlLabel control={<Switch onChange={(event) => setIsOnline(event.target.checked)} />} label={isOnline ? 'Online' : 'Offline'} />

      {isOnline ? <div>
        <TextField
          label='Link meeting'
          name='linkMeeting'
          variant="outlined"
          size='small'
          style={{ width: '100%', marginTop: '1rem' }}
          value={formikCreate.values.linkMeeting}
          onChange={formikCreate.handleChange}
        />
      </div> : <div>
        <div>
          <TextField
            label='Room'
            name='room'
            variant="outlined"
            size='small'
            style={{ width: '100%', marginTop: '1rem' }}
            value={formikCreate.values.room}
            onChange={formikCreate.handleChange}
          />
          {formikCreate.errors.room && formikCreate.touched.room && (
            <div className='text-[#ec5555]'>{formikCreate.errors.room}</div>
          )}
        </div>
        <div>
          <TextField
            label='Address'
            name='address'
            variant="outlined"
            size='small'
            style={{ width: '100%', marginTop: '1rem' }}
            value={formikCreate.values.address}
            onChange={formikCreate.handleChange} />
          {formikCreate.errors.address && formikCreate.touched.address && (
            <div className='text-[#ec5555]'>{formikCreate.errors.address}</div>
          )}
        </div>
      </div>}

      <div className='mt-4'>Description</div>
      <TextareaAutosize
        name='description'
        value={formikCreate.values.description}
        minRows={2}
        maxRows={5}
        style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
        onChange={formikCreate.handleChange}
      />
      {formikCreate.errors.description && formikCreate.touched.description && (
        <div className='text-[#ec5555]'>{formikCreate.errors.description}</div>
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
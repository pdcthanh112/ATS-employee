import React, { useEffect, useState } from 'react'
import './InterviewPage.scss'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading'
import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import { getAllInterview } from '../../../apis/interview';
import InterviewIcon from '../../../assets/icon/calendar.png'
import SearchIcon from '../../../assets/icon/filter.png'
import AddIcon from '../../../assets/icon/plus.png'
import ListInterviewSchedule from '../ListSInterview/ListInterview';
import { positionName } from '../../../utils/constants';


const SchedulePage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listInterviewSchedule, setListInterviewSchedule] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
        console.log(response.data);
        setListInterviewSchedule(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

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
      jobApplyId: '',
      linkMeeting: '',
      purpose: '',
      room: '',
      round: '',
      subject: '',
      time: '',
      type: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please input name of recruitment plan'),
      periodFrom: Yup.string().required('Please input begin date'),
      periodTo: Yup.string().required('Please input end date'),
      amount: Yup.number().positive('Invalid value').integer(),
      totalSalary: Yup.string().required('Please input total salary').min(1, 'Invalid value')
    }),
    onSubmit: (values) => {
      // setIsLoading(true)
      // createRecruitmentPlan(currentUser.token, values).then((response) => {
      //   response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      // }).then(setIsLoading(false))
    }
  })

  return (
    <React.Fragment>
      <div className='schedule-container'>
        <div className='flex px-8 py-8'>
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
              <span className='font-medium text-3xl mr-3'>Create interview</span>
              <img src={InterviewIcon} alt='' width={'30rem'} />
            </div>
            <div>
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <div>
                    <div className='font-semibold text-lg mt-3'>Name</div>
                    <input type={'text'} name='name' className='focus:outline-none' placeholder='Name of recruitment plan' value={formik.values.name} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.3rem 2rem', borderRadius: '0.5rem', width: '100%' }} />
                    {formik.errors.name && formik.touched.name && (
                      <div className='text-[#ec5555]'>{formik.errors.name}</div>
                    )}
                  </div>
                  <div className='font-semibold text-xl mt-4'>Period</div>
                  <div className='grid grid-cols-2 px-1'>
                    <div>
                      <div className='font-medium text-base'>from</div>
                      <input type={'date'} name='periodFrom' className='focus:outline-none' value={formik.values.periodFrom} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                      {formik.errors.periodFrom && formik.touched.periodFrom && (
                        <div className='text-[#ec5555]'>{formik.errors.periodFrom}</div>
                      )}
                    </div>
                    <div>
                      <div className='font-medium text-base'>to</div>
                      <input type={'date'} name='periodTo' className='focus:outline-none' value={formik.values.periodTo} onChange={formik.handleChange} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                      {formik.errors.periodTo && formik.touched.periodTo && (
                        <div className='text-[#ec5555]'>{formik.errors.periodTo}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className='mt-3 flex justify-around'>
                    <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Cancel</button>
                    <button type='submit' className='btn-create'>Save</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default SchedulePage
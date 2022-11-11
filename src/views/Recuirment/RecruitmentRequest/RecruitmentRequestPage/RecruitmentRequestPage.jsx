import React, { useState, useEffect } from 'react'
import './RecruitmentRequestPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'
import RequestIcon from '../../../../assets/icon/request.png'
import SearchIcon from '../../../../assets/icon/filter.png'
import AddIcon from '../../../../assets/icon/plus.png'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete, TextareaAutosize } from '@mui/material';
import { getAllRecruimentRequest } from '../../../../apis/recruimentRequestApi'
import ListRecruitmentRequest from '../ListRecruitmentRequest/ListRecruitmentRequest'

const RecruitmentRequestPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  //console.log(currentUser);
  const categoryData = useSelector((state) => state.categoryData.data);

  const [listRecruitmentRequest, setListRecruitmentRequest] = useState([])
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [createRecruitmentRequestObject, setCreateRecruitmentRequestObject] = useState({
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
    planDetailId: 0,
    positionId: 0,
    requirement: '',
    salaryFrom: '',
    salaryTo: '',
    typeOfWork: ''
  })

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
        //console.log(response.data);
        setListRecruitmentRequest(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  const onChangePlanDetailObject = (id, value) => {
    setCreateRecruitmentRequestObject(() => ({
      ...createRecruitmentRequestObject,
      [id]: value
    }))
  }

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

  return (
    <React.Fragment>
      <div className='recruitmentrequest-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Recruitment Request</span>
          <img src={RequestIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-request' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
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
            <div>
                <TextField label="Job title" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} onChange={(value) => onChangePlanDetailObject('name', value)} />
                <div className='font-semibold text-lg mt-2'>Period</div>
                <div className='grid grid-cols-2 px-1'>
                  <div className=''>
                    <div className='font-medium text-base'>from</div>
                    <input type={'date'} name='periodFrom' className='focus:outline-none' onChange={(value) => onChangePlanDetailObject('periodFrom', value)} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                  </div>
                  <div>
                    <div className='font-medium text-base'>to</div>
                    <input type={'date'} name='periodTo' className='focus:outline-none' onChange={(value) => onChangePlanDetailObject('periodTo', value)} style={{ border: '1px solid #116835', padding: '0.4rem 2rem', borderRadius: '0.5rem' }} />
                  </div>
                </div>
                <Autocomplete
                    options={categoryData.jobTitle}
                    size={'small'}
                    sx={{ width: '100%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Position" />}
                    onInputChange={(event, value) => { onChangePlanDetailObject('industry', value) }} />
                <div className='flex'>
                  <TextField label="Amount" variant="outlined" size='small' sx={{ width: '20%', marginTop: '1rem', marginRight: '1rem' }} />
                  <TextField label="Salary" variant="outlined" size='small' sx={{ width: '40%', marginTop: '1rem', marginRight: '1rem' }} />
                  <Autocomplete
                    options={categoryData.jobTitle}
                    size={'small'}
                    sx={{ width: '35%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Position" />}
                    onInputChange={(event, value) => { onChangePlanDetailObject('industry', value) }} />
                </div>
                <div className='mt-4'>Reason</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
                <div className='mt-4'>Description</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
                <div className='mt-4'>Requirment</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
                <div className='mt-4'>Note</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                />
              </div>
              <div className='mt-3 flex justify-around'>
                <button onClick={() => { setOpenModalCreate(false) }} className='btn-create'>Cancel</button>
                <button type='submit' className='btn-create'>Save</button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default RecruitmentRequestPage
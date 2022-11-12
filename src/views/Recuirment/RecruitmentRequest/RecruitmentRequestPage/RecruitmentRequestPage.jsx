import React, { useState, useEffect } from 'react'
import './RecruitmentRequestPage.scss'

import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'
import RequestIcon from '../../../../assets/icon/request.png'
import SearchIcon from '../../../../assets/icon/filter.png'
import AddIcon from '../../../../assets/icon/plus.png'
import CurrencyFormat from 'react-currency-format';
import { Box, Modal, Pagination, Stack, TextField, Autocomplete, TextareaAutosize } from '@mui/material';
import { getAllRecruimentRequest, getApprovedByDepartment } from '../../../../apis/recruimentRequestApi'
import ListRecruitmentRequest from '../ListRecruitmentRequest/ListRecruitmentRequest'
import { educationLevelData, experienceData, typeOfWorkData } from '../../../../utils/dropdownData'
const RecruitmentRequestPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
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


  const onChangeRecruitmentRequestObject = (id, value) => {
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
              <div>
                <div className='grid grid-cols-2 px-1'>
                  <Autocomplete
                    options={categoryData.position}
                    size={'small'}
                    sx={{ width: '80%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Position" />}
                    onInputChange={(event, value) => { onChangeRecruitmentRequestObject('industry', value) }} />

                  <TextField label="Job title" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} onChange={(value) => onChangeRecruitmentRequestObject('name', value)} />
                </div>

                <div className='grid grid-cols-2 px-1'>
                  <Autocomplete
                    options={experienceData()}
                    size={'small'}
                    sx={{ width: '80%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Experience" />}
                    onInputChange={(event, value) => { onChangeRecruitmentRequestObject('experience', value) }} />
                  <Autocomplete
                    options={typeOfWorkData()}
                    size={'small'}
                    sx={{ width: '100%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Type of work" />}
                    onInputChange={(event, value) => { onChangeRecruitmentRequestObject('typeOfWork', value) }} />
                </div>

                <div className='grid grid-cols-2 px-1'>
                  <Autocomplete
                    options={educationLevelData()}
                    size={'small'}
                    sx={{ width: '80%', marginTop: '1rem' }}
                    renderInput={(params) => <TextField {...params} label="Education level" />}
                    onInputChange={(event, value) => { onChangeRecruitmentRequestObject('educationLevel', value) }} />

                  <TextField label="Salary" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} onChange={(value) => onChangeRecruitmentRequestObject('salary', value)} />
                </div>

                <div className='grid grid-cols-2 px-1'>
                  <TextField label="" placeholder='' type={'date'} variant="outlined" size='small' style={{ width: '80%', marginTop: '1rem' }} onChange={(value) => onChangeRecruitmentRequestObject('expiryDate', value)} />
                  <TextField label="Industry" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} onChange={(value) => onChangeRecruitmentRequestObject('industry', value)} />
                </div>

                <div className='grid grid-cols-2 px-1'>
                  {/* <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='totalSalary' placeholder='1,000,000 VNĐ' value={formik.values.totalSalary} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '100%' }} />
                  <CurrencyFormat thousandSeparator={true} suffix={' VNĐ'} name='totalSalary' placeholder='1,000,000 VNĐ' value={formik.values.totalSalary} onChange={formik.handleChange} className='focus:outline-none' style={{ border: '1px solid #116835', padding: '0.3rem 1rem', borderRadius: '0.5rem', width: '100%' }} /> */}
                </div>

                <Autocomplete
                  options={listApprovedPlanDetail}
                  size={'small'}
                  sx={{ width: '100%', marginTop: '1rem' }}
                  getOptionLabel={option => option.name}
                  renderInput={(params) => <TextField {...params} label="Plan detail" />}
                  onChange={(event, value) => { onChangeRecruitmentRequestObject('planDetailId', value.id) }} />

                <Autocomplete
                  options={categoryData.province}
                  size={'small'}
                  sx={{ width: '100%', marginTop: '1rem' }}
                  renderInput={(params) => <TextField {...params} label="City name" />}
                  onChange={(event, value) => { onChangeRecruitmentRequestObject('cityName', value) }} />

                <TextField label="Address" variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} onChange={(value) => onChangeRecruitmentRequestObject('address', value)} />

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
                  onChange={(event) => onChangeRecruitmentRequestObject('description', event.target.value)}
                />
                <div className='mt-4'>Requirment</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                  onChange={(event) => onChangeRecruitmentRequestObject('requirment', event.target.value)}
                />
                <div className='mt-4'>Benefit</div>
                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835' }}
                  onChange={(event) => onChangeRecruitmentRequestObject('benefit', event.target.value)}
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
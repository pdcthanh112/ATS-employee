import React, { useEffect, useState } from 'react'
import './InterviewSchedulePage.scss'

import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading'
import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import { getAllInterview } from '../../../apis/interview';
import RequestIcon from '../../../assets/icon/request.png'
import SearchIcon from '../../../assets/icon/filter.png'
import AddIcon from '../../../assets/icon/plus.png'
import ListInterviewSchedule from '../ListSInterviewchedule/ListInterviewSchedule';


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

  return (
    <React.Fragment>
      <div className='schedule-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Schedule</span>
          <img src={RequestIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-schedule' onClick={() => setOpenModalCreate(true)} title='Create a new recruitment request'>
          <span className='mr-1'>Create a schedule</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={AddIcon} alt='' /></span>
        </div>

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
            <div className='modal-title'>
              <span className='font-medium text-3xl mr-3'>Create</span>

            </div>

          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default SchedulePage
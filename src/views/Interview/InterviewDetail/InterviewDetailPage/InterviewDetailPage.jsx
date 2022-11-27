import React, { useState, useEffect } from 'react'
import './InterviewDetailPage.scss'

import ListInterviewDetail from '../ListInterviewDetail/ListInterviewDetail'
import { useSelector } from 'react-redux';
import { getAllInterviewDetail, getInterviewDetailByDepartment } from '../../../../apis/interviewDetailApi';

import ReactLoading from 'react-loading';
import {Pagination, Stack } from '@mui/material';

import InterviewDetailIcon from '../../../../assets/icon/interview-detailImage.png'
import { positionName } from '../../../../utils/constants';


const InterviewDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [listInterviewDetail, setListInterviewDetail] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = currentUser.employee.position.name === positionName.POSITION_HR ? await getAllInterviewDetail(currentUser.token, pagination.currentPage - 1, 4) : await getInterviewDetailByDepartment(currentUser.token, currentUser.employee.department.name, pagination.currentPage - 1, 5);
      if (response) {
        setListInterviewDetail(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        setIsLoading(false)
      }
    }
    fetchData();
  }, [pagination.currentPage])

  return (
    <React.Fragment>
      <div className='interview-container'>
        <div className='flex px-8 pt-8'>
          <span className='font-medium text-3xl mr-3'>Interview detail</span>
          <img src={InterviewDetailIcon} alt='' width={'40rem'} />
        </div>

        {/* {currentUser.employee.position.name === positionName.POSITION_HR && <div className='create-schedule' onClick={() => setOpenModalCreate(true)} title='Create a new interview'>
          <span className='mr-1'>Create an interview</span>
          <span style={{ width: '1.2rem', height: '1.2rem', margin: 'auto 0' }}><img src={AddIcon} alt='' width={'30rem'} /></span>
        </div>} */}

        <div className='filter-container'>

          {/* <div className='inputName'>
            <input type={'text'} className='form-control' placeholder='Input name of candidate...' onChange={formikSearch.handleChange} />
          </div> */}

          {/* <Autocomplete
            blurOnSelect={true}
            options={interviewTypeData()}
            size={'small'}
            sx={{ width: 170, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Status" />}
          onChange={(event, value) => { handleChangeSearchObject('typeOfWork', value.value) }}
          /> */}

          {/* <div className='mr-5'>
            <input type={'date'} className='form-control' onChange={() => { formikSearch.handleChange()}} 
            />
          </div>

          <div className='mr-5'> 
            <input type={'date'} className='form-control' onChange={formikSearch.handleChange} />
          </div>

          <img src={SearchIcon} alt="" width={'50rem'} title='Search' onClick={formikSearch.handleSubmit} /> */}
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListInterviewDetail listInterviewDetail={listInterviewDetail} />}

        <div className='flex justify-center bg-[#FFF] w-[90%] mx-auto'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>
    </React.Fragment>
  )
}

export default InterviewDetailPage
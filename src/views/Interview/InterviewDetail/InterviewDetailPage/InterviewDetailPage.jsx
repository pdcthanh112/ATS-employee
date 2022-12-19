import React, { useState } from 'react'
import './InterviewDetailPage.scss'
import { useQuery } from 'react-query';
import ListInterviewDetail from '../ListInterviewDetail/ListInterviewDetail'
import { useSelector } from 'react-redux';
import { getAllInterviewDetail, getInterviewDetailByDepartment } from '../../../../apis/interviewDetailApi';

import ReactLoading from 'react-loading';
import {Pagination, Stack } from '@mui/material';

import InterviewDetailIcon from '../../../../assets/icon/interview-detailImage.png'
import { departmentName } from '../../../../utils/constants';


const InterviewDetailPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  console.log(currentUser);

  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })

  const { data: listInterviewDetail, isLoading } = useQuery(['listInterviewDetail', pagination], async () => currentUser.employee.department.id === departmentName.HR_DEPARTMENT ?
    await getAllInterviewDetail(pagination.currentPage - 1, 10).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    })
    :
    await getInterviewDetailByDepartment(currentUser.employee.department.name, pagination.currentPage - 1, 10).then((response) => {
      setPagination({ ...pagination, totalPage: response.data.totalPage })
      return response.data.responseList
    }))
    
  return (
    <React.Fragment>
      <div className='interview-container'>
        <div className='flex px-8 py-2'>
          <span className='font-medium text-3xl mr-3'>Interview detail</span>
          <img src={InterviewDetailIcon} alt='' width={'40rem'} />
        </div>      

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

        <div className='flex justify-center'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
          </Stack>
        </div>
      </div>
    </React.Fragment>
  )
}

export default InterviewDetailPage
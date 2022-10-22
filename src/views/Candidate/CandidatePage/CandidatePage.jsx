import React, { useState, useEffect } from 'react'
import './CandidatePage.scss'
import { useSelector } from "react-redux";
import ReactLoading from 'react-loading'

import CandidateIcon from '../../../assets/icon/candidate.png'
import SearchIcon from '../../../assets/icon/filter.png'
import { getAllCandidate } from '../../../apis/candidateApi'
import ListCandidate from '../ListCandidate/ListCandidate';

import { Pagination, Stack, TextField, Autocomplete } from '@mui/material';

const CandidatePage = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser.data);
  const [isLoading, setIsLoading] = useState(true)
  const [listCandidate, setListCandidate] = useState([])
  const [searchObject, setSearchObject] = useState({ name: "", position: "" });
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getAllCandidate(pagination.currentPage - 1, 10, currentUser.token);
      if (response) {
        //console.log(response.data);
        setListCandidate(response.data)
        //setPagination({ ...pagination, totalPage: response.data.totalPages })
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
    <div className='candidatepage-container'>
      <div className='title-container'>
        <span className='font-medium text-3xl mr-3'>Candidate</span>
        <img src={CandidateIcon} alt='' width={'30rem'} />
      </div>
      <div className='search-container'>
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

        <Autocomplete
          blurOnSelect={true}
          //options={typeOfWorkData()}
          size={'small'}
          sx={{ width: 170, marginRight: 2 }}
          renderInput={(params) => <TextField {...params} label="Loại công việc" />}
          onChange={(event, value) => { handleChangeSearchObject('typeOfWork', value.value) }} />

        <img src={SearchIcon} alt="" width={'50rem'} title='Search' onClick={() => onHandleSearch()} />
      </div>

      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListCandidate listCandidate={listCandidate} />}

      <div className='pagination-container'>
        <Stack spacing={2}>
          <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
        </Stack>
      </div>
    </div>
  )
}

export default CandidatePage
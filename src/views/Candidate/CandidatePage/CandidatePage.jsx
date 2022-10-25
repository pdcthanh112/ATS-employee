import React, { useState, useEffect } from 'react'
import './CandidatePage.scss'
import { useSelector } from "react-redux";
import ReactLoading from 'react-loading'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import CandidateIcon from '../../../assets/icon/candidate.png'
import SearchIcon from '../../../assets/icon/filter.png'
import AddIcon from '../../../assets/icon/plus.png'
import { getAllCandidate } from '../../../apis/candidateApi'
import ListCandidate from '../ListCandidate/ListCandidate';

const CandidatePage = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser.data);
  const [isLoading, setIsLoading] = useState(true)
  const [listCandidate, setListCandidate] = useState([])
  const [searchObject, setSearchObject] = useState({ name: "", position: "" });
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)

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
    <React.Fragment>
      <div className='candidatepage-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Candidate</span>
          <img src={CandidateIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-candidate' onClick={() => setOpenModalCreate(true)} title='Create a new candidate'>
          <span className='mr-1'>Create candidate</span>
          <span style={{width: '1.2rem', height: '1.2rem', margin: 'auto 0'}}><img src={AddIcon} alt=''/></span>
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

export default CandidatePage
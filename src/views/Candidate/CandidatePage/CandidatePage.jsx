import React, { useState, useEffect } from 'react'
import './CandidatePage.scss'
import { useSelector } from "react-redux";
import ReactLoading from 'react-loading'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import { useFormik } from 'formik'
import * as Yup from 'yup'

import CandidateIcon from '../../../assets/icon/candidate.png'
import SearchIcon from '../../../assets/icon/filter.png'
import AddIcon from '../../../assets/icon/plus.png'
import { getAllCandidate } from '../../../apis/candidateApi'
import ListCandidate from '../ListCandidate/ListCandidate';
import { DEFAULT_PASSWORD } from '../../../utils/constants'

const CandidatePage = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser.data);
  const [isLoading, setIsLoading] = useState(true)
  const [listCandidate, setListCandidate] = useState([])
  const [searchObject, setSearchObject] = useState({ name: "", position: "" });
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [fileCV, setFileCV] = useState(null)

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
        console.log(response.data);
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

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: DEFAULT_PASSWORD,
      position: '',
      phone: '',
      linkCV: '',
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Please input your name'),
      email: Yup.string().required('Please input email').matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'This email is invalid'),
      address: Yup.string().required('Please input your address'),
      phone: Yup.string().required('Please input your phone number').matches(/^[0-9\-\\+]{10}$/, 'This phone number is invalid'),
    }),
    onSubmit: async (values) => {
      // if (fileImage !== null) {
      //   const imageRef = ref(storage, `candidate-avatar/${fileImage.name + uuidv4()}`)
      //   await uploadBytes(imageRef, fileImage).then((snapshot) => {
      //     getDownloadURL(snapshot.ref).then(url => {
      //       values.image = url
      //     })
      //   })
      // }
      // console.log('RRRRRRR', values);
      // updateProfileCandidate(currentUser.candidate.id, currentUser.token, values).then((response) => {
      //   response.status === responseStatus.SUCCESS ? toast.success('Edit profile successfully') : toast.error('Edit profile fail')
      // })
    }
  })

  return (
    <React.Fragment>
      <div className='candidatepage-container'>
        <div className='title-container'>
          <span className='font-medium text-3xl mr-3'>Candidate</span>
          <img src={CandidateIcon} alt='' width={'30rem'} />
        </div>

        <div className='create-candidate' onClick={() => setOpenModalCreate(true)} title='Create a new candidate'>
          <span className='mr-1'>Create candidate</span>
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
            <span className='font-medium text-3xl'>Create candidate</span>
            <form onSubmit={formik.handleSubmit}>
              <div className=''>
                <label className='text-lg'>Email</label><br />
                <div className='modal-content__field'>
                  <input type={'text'} className={`form-control border-none `} name='email' value={formik.values.fullname} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <div className='text-[#ec5555]'>{formik.errors.email}</div>
                )}
              </div>
              <div className=''>
                <label className='text-lg'>Fullname: </label><br />
                <div className='field-input'>
                  <input type={'text'} className={`form-control border-none ${formik.errors.fullname && formik.touched.fullname && 'input-error'}`} name='fullname' placeholder='Nhập tên của bạn' value={formik.values.fullname} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.fullname && formik.touched.fullname && (
                  <div className='text-[#ec5555]'>{formik.errors.fullname}</div>
                )}
              </div>
              <div className=''>
                <div>
                  <input type={'file'} className='form-control border-none text-sm' name='image' onChange={(e) => { setFileCV(e.target.files[0]) }} /><br />
                </div>
              </div>

              <div className=''>
                <label className='text-lg'>Phone</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`form-control border-none ${formik.errors.phone && formik.touched.phone && 'input-error'}`} name='phone' placeholder='Nhập số điện thoại của bạn' value={formik.values.phone} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.phone && formik.touched.phone && (
                  <div className='text-[#ec5555]'>{formik.errors.phone}</div>
                )}
              </div>
              <div className=''>
                <label className='text-lg'>Address</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`form-control border-none ${formik.errors.address && formik.touched.address && 'input-error'}`} name='address' placeholder='Nhập địa chỉ của bạn' value={formik.values.address} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.address && formik.touched.address && (
                  <div className='text-[#ec5555]'>{formik.errors.address}</div>
                )}
              </div>
              <button type='submit' className='btn-save-edit'>Save</button>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default CandidatePage
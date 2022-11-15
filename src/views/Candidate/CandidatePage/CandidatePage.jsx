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

  const currentUser = useSelector((state) => state.auth.login.currentUser);

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
        //console.log('CCCCCCCCCCCCCCC',response.data);
        setListCandidate(response.data.responseList)
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
      fullname: '',
      email: '',
      password: DEFAULT_PASSWORD,
      position: '',
      phone: '',
      linkCV: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please input email').matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'This email is invalid'),
      fullname: Yup.string().required('Please input your name'),
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
        <div className='flex mx-5 my-3'>
          <span className='font-semibold text-3xl mr-3'>Candidate</span>
          <img src={CandidateIcon} alt='' width={'30rem'} />
        </div>

        <div className='bg-[#E9FCE9] flex justify-between px-10 py-4'>
          <div className='flex'>
            <img src={SearchIcon} alt="" width={'40rem'} title='Search' onClick={() => onHandleSearch()} />
            <div className='inputName'>
              <input type={'text'} className='input-tag focus:outline-none' placeholder='Nhập tên ứng viên...' onChange={(event) => { handleChangeSearchObject('name', event.target.value) }} />
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
          </div>
          <div className='flex bg-[#1DAF5A] px-3 hover:cursor-pointer rounded-lg' onClick={() => setOpenModalCreate(true)} title='Create a new candidate'>
            <i className="fa-solid fa-plus text-white" style={{ marginTop: '0.8rem' }}></i>
            <span className='ml-1 mt-2 font-semibold text-white'>Create candidate</span>
          </div>
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> : <ListCandidate listCandidate={listCandidate} />}

        <div className='pagination-container'>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} variant="outlined" shape="rounded" />
          </Stack>
        </div>
      </div>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <span className='font-medium text-3xl'>Create candidate</span>
            <form onSubmit={formik.handleSubmit}>
              <div className='my-3'>
                <label className='text-lg'>Fullname</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.fullname && formik.touched.fullname && 'input-error'}`} name='fullname' placeholder='Nhập tên của bạn' value={formik.values.fullname} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.fullname && formik.touched.fullname && (
                  <div className='text-[#ec5555]'>{formik.errors.fullname}</div>
                )}
              </div>
              <div className='my-3'>
                <label className='text-lg'>Email</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.email && formik.touched.email && 'input-error'}`} name='email' placeholder='Nhập email của bạn' value={formik.values.email} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <div className='text-[#ec5555]'>{formik.errors.email}</div>
                )}
                {/* {registerStatus !== responseStatus.SUCCESS && registerStatus.includes('email') && (
                  <div className='text-[#ec5555]'>Email is alrealy exist</div>
                )} */}
              </div>

              <div className='my-3'>
                <label className='text-lg'>Address</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.address && formik.touched.address && 'input-error'}`} name='address' placeholder='Nhập địa chỉ của bạn' value={formik.values.address} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.address && formik.touched.address && (
                  <div className='text-[#ec5555]'>{formik.errors.address}</div>
                )}
              </div>
              <div className='my-3'>
                <label className='text-lg'>Phone</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.phone && formik.touched.phone && 'input-error'}`} name='phone' placeholder='Nhập số điện thoại của bạn' value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} /><br />
                </div>
                {formik.errors.phone && formik.touched.phone && (
                  <div className='text-[#ec5555]'>{formik.errors.phone}</div>
                )}
                {/* {registerStatus !== responseStatus.SUCCESS && registerStatus.includes('Phone number') && (
                  <div className='text-[#ec5555]'>Phone number is alrealy exist</div>
                )} */}
              </div>
              <div className='flex justify-evenly'>
                <button onClick={() => setOpenModalCreate(false)} className='bg-[#20D489] text-[#FFF] px-5 py-2 rounded-lg'>Cancel</button>
                <button type='submit' className='bg-[#20D489] text-[#FFF] px-5 py-2 rounded-lg'>Create</button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default CandidatePage
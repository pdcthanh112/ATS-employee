import React, { useState, useEffect } from 'react'
import './CandidatePage.scss'
import { useSelector } from "react-redux";
import ReactLoading from 'react-loading'

import { Box, Modal, Pagination, Stack, TextField, Autocomplete } from '@mui/material';

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CandidateIcon from '../../../assets/icon/candidateImage.png'
import SearchIcon from '../../../assets/icon/filter.png'
import { createCandidate, getAllCandidate } from '../../../apis/candidateApi'
import ListCandidate from '../ListCandidate/ListCandidate';
import { DEFAULT_PASSWORD, responseStatus } from '../../../utils/constants'
import { getPositionByDepartment } from '../../../apis/department';

const CandidatePage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [isLoading, setIsLoading] = useState(true)
  const [listCandidate, setListCandidate] = useState([])
  const [searchObject, setSearchObject] = useState({ name: "", position: "" });
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [fileCV, setFileCV] = useState(null)
  const [listPosition, setListPosition] = useState([])

  const style = {
    position: 'absolute',
    top: '22rem',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: 600,
    overflow: 'scroll',
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPositionByDepartment(currentUser.token, currentUser.employee.department.id, 0, 20);
      if (response) {
        setListPosition(response.data.responseList)
      }
    }
    fetchData();
  }, [])

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

  const formikCreate = useFormik({
    initialValues: {
      address: '',
      dob: '',
      email: '',
      gender: '',
      image: '',
      name: '',
      notificationToken: '',
      password: DEFAULT_PASSWORD,
      phone: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please input candidate email').matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'This email is invalid'),
      name: Yup.string().required('Please input candidate name'),
      address: Yup.string().required('Please input candidate address'),
      phone: Yup.string().required('Please input candidate phone number').matches(/^[0-9\-\\+]{10}$/, 'This phone number is invalid'),
    }),
    onSubmit: async (values) => {
      await createCandidate(values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Create successfully') : toast.error('Create fail')
      })
    }
  })
  // const formikSearch = useFormik({
  //   initialValues: {
  //     name: '',
  //     position: ''
  //   },
  //   onSubmit: async (values) => {
  //     if (fileImage !== null) {
  //       const imageRef = ref(storage, `candidate-avatar/${fileImage.name + uuidv4()}`)
  //       await uploadBytes(imageRef, fileImage).then((snapshot) => {
  //         getDownloadURL(snapshot.ref).then(url => {
  //           values.image = url
  //         })
  //       })
  //     }
  //     console.log('RRRRRRR', values);
  //     updateProfileCandidate(currentUser.candidate.id, currentUser.token, values).then((response) => {
  //       response.status === responseStatus.SUCCESS ? toast.success('Edit profile successfully') : toast.error('Edit profile fail')
  //     })
  //   }
  // })

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
              <input type={'text'} className='focus:outline-none' placeholder='Nhập tên ứng viên...' style={{ margin: '5px 7px' }} onChange={(event) => { handleChangeSearchObject('name', event.target.value) }} />
            </div>
            <Autocomplete
              options={listPosition}
              size={'small'}
              sx={{ width: 170, marginRight: 2 }}
              renderInput={(params) => <TextField {...params} label="Position" />}
              onChange={(event, value) => { handleChangeSearchObject('typeOfWork', value.value) }} />

            <Autocomplete
              //options={typeOfWorkData()}
              size={'small'}
              sx={{ width: 170, marginRight: 2 }}
              renderInput={(params) => <TextField {...params} label="Job name" />}
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
            <form onSubmit={formikCreate.handleSubmit}>
              <div className='my-3'>
                <label className='text-lg'>Fullname</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreate.errors.fullname && formikCreate.touched.fullname && 'input-error'}`} name='name' placeholder='Input candidate name' value={formikCreate.values.name} onChange={formikCreate.handleChange} /><br />
                </div>
                {formikCreate.errors.name && formikCreate.touched.name && (
                  <div className='text-[#ec5555]'>{formikCreate.errors.name}</div>
                )}
              </div>
              <div className='my-3'>
                <label className='text-lg'>Email</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreate.errors.email && formikCreate.touched.email && 'input-error'}`} name='email' placeholder='Input candidate email' value={formikCreate.values.email} onChange={formikCreate.handleChange} /><br />
                </div>
                {formikCreate.errors.email && formikCreate.touched.email && (
                  <div className='text-[#ec5555]'>{formikCreate.errors.email}</div>
                )}
                {/* {registerStatus !== responseStatus.SUCCESS && registerStatus.includes('email') && (
                  <div className='text-[#ec5555]'>Email is alrealy exist</div>
                )} */}
              </div>

              <div className='my-3'>
                <label className='text-lg'>Address</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreate.errors.address && formikCreate.touched.address && 'input-error'}`} name='address' placeholder='Input candidate address' value={formikCreate.values.address} onChange={formikCreate.handleChange} /><br />
                </div>
                {formikCreate.errors.address && formikCreate.touched.address && (
                  <div className='text-[#ec5555]'>{formikCreate.errors.address}</div>
                )}
              </div>
              <div className='my-3'>
                <label className='text-lg'>Phone</label><br />
                <div className='field-input'>
                  <input type={'text'} className={`input-tag focus:outline-none ${formikCreate.errors.phone && formikCreate.touched.phone && 'input-error'}`} name='phone' placeholder='Input phone number' value={formikCreate.values.phone} onChange={formikCreate.handleChange} onBlur={formikCreate.handleBlur} /><br />
                </div>
                {formikCreate.errors.phone && formikCreate.touched.phone && (
                  <div className='text-[#ec5555]'>{formikCreate.errors.phone}</div>
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  )
}

export default CandidatePage
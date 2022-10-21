import React, { useState, useEffect } from 'react'
import { getRecruimentRequestDetail } from '../../../apis/recruimentRequestApi';
import './RecruitmentDetail.scss'
import { useParams } from 'react-router-dom'
import ReactLoading from 'react-loading'
import { Box, Modal } from '@mui/material';

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { storage } from '../../../configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';

const RecruitmentDetail = () => {

  const recruimentId = useParams().id

  const [recruiment, setRecruitment] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const [fileCV, setFileCV] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getRecruimentRequestDetail(recruimentId);
      if (response) {
        console.log(response.data.data);
        setRecruitment(response.data.data)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

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

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      phone: "",
      linkCV: ""
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Please input your name'),
      email: Yup.string().required('Please input email').matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'This email is invalid'),
      phone: Yup.string().required('Please input your phone number').matches(/^[0-9\-\\+]{10}$/, 'This phone number is invalid'),
    }),
    onSubmit: async (values) => {
      if (fileCV == null) {  
        formik.errors.linkCV = "Please submit your CV";
      } else {
        const cvRef = ref(storage, `candidate-CV/${fileCV.name + uuidv4()}`)
        await uploadBytes(cvRef, fileCV).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(url => {
            values.linkCV = url
          })
        })
      }
      console.log('RRRRRR', values);
      // regiserUser(values).then((response) => {
      //   response === responseStatus.SUCCESS ? setRegisterStatus(responseStatus.SUCCESS) : setRegisterStatus(responseStatus.FAILURE)
      // })
    }
  })

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div className='recruitment-detail-container'>
          <div className='recruitment-detail__title'>{recruiment.position.name}</div>
          <div className='recruitment-detail__summary grid grid-cols-3 gap-4'>
            <div>
              <i className="fa-sharp fa-solid fa-file-lines"></i>
              <span><strong className='ml-1'>Type of work: </strong> {recruiment.typeOfWork}</span>
            </div>
            <div>
              <i className="fa-sharp fa-solid fa-file-lines"></i>
              <span><strong className='ml-1'>Job level: </strong> {recruiment.jobLevel}</span>
            </div>
            <div>
              <i className="fa-solid fa-calendar-days"></i>
              <span><strong className='ml-1'>Create date: </strong> {recruiment.date}</span>
            </div>
            <div>
              <i className="fa-solid fa-building"></i>
              <span><strong className='ml-1'>Industry: </strong> {recruiment.industry}</span>
            </div>
            <div>
              <i className="fa-solid fa-money-bill-wave"></i>
              <span><strong className='ml-1'>Salary: </strong> {recruiment.salary}</span>
            </div>
            <div>
              <i className="fa-solid fa-calendar-days"></i>
              <span><strong className='ml-1'>Expired date: </strong> {recruiment.expiryDate}</span>
            </div>
            <div>
              <i className="fa-sharp fa-solid fa-school"></i>
              <span><strong className='ml-1'>Experience: </strong> {recruiment.experience}</span>
            </div>
            <div>
              <i className="fa-solid fa-calendar-days"></i>
              <span><strong className='ml-1'>Status: </strong> {recruiment.status}</span>
            </div>
          </div>
          <div className='inline-flex mt-3'>
            <div className='w-5/6'>{recruiment.description}</div>
            <button className='recruitment-detail__apply-button' onClick={() => setOpenModal(true)}>APPLY</button>
          </div>
        </div>
      }

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={style}>
          <div className='modal-container'>
            <div className='modal-title'>Apply job</div>
            <div>
              <form onSubmit={formik.handleSubmit}>
                <div className='my-3'>
                  <label className='text-lg'>Fullname</label><br />
                  <div className='field-input'>
                    <i className="fa-solid fa-user mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                    <input type={'text'} className={`form-control  border-none ${formik.errors.fullname && formik.touched.fullname && 'input-error'}`} name='fullname' placeholder='Nhập tên của bạn' value={formik.values.fullname} onChange={formik.handleChange} /><br />
                  </div>
                  {formik.errors.fullname && formik.touched.fullname && (
                    <div className='text-[#ec5555]'>{formik.errors.fullname}</div>
                  )}
                </div>
                <div className='my-3'>
                  <label className='text-lg'>Email</label><br />
                  <div className='field-input'>
                    <i className="fa-solid fa-envelope mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                    <input type={'text'} className={`form-control  border-none ${formik.errors.email && formik.touched.email && 'input-error'}`} name='email' placeholder='Nhập email của bạn' value={formik.values.email} onChange={formik.handleChange} /><br />
                  </div>
                  {formik.errors.email && formik.touched.email && (
                    <div className='text-[#ec5555]'>{formik.errors.email}</div>
                  )}
                </div>
                <div className='my-3'>
                  <label className='text-lg'>Phone</label><br />
                  <div className='field-input'>
                    <i className="fa-solid fa-mobile-screen-button mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                    <input type={'text'} className={`form-control  border-none ${formik.errors.phone && formik.touched.phone && 'input-error'}`} name='phone' placeholder='Nhập số điện thoại của bạn' value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} /><br />
                  </div>
                  {formik.errors.phone && formik.touched.phone && (
                    <div className='text-[#ec5555]'>{formik.errors.phone}</div>
                  )}
                </div>
                <div className='my-3'>
                  <label className='text-lg'>Curriculum vitae</label><br />
                  <div className='field-input'>
                    <input type={'file'} className={`form-control  border-none`} name='fileCV' onChange={(e) => { setFileCV(e.target.files[0]) }} /><br />
                  </div>
                  {formik.errors.linkCV && (
                    <div className='text-[#ec5555]'>{formik.errors.linkCV}</div>
                  )}
                </div>
                <div><button type='submit' className='btn-submit'>Submit</button></div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default RecruitmentDetail


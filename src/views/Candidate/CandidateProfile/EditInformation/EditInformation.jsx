import React, { useEffect, useState } from 'react'
import './EditInformation.scss'
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { storage } from '../../../../configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import { updateProfileCandidate } from '../../../../apis/candidateApi';
import { responseStatus } from '../../../../utils/constants'
import { useDispatch } from "react-redux";

const EditInformation = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser.data);
  console.log(currentUser);
  const [fileImage, setFileImage] = useState(null)

  const formik = useFormik({
    initialValues: {
      fullname: currentUser.candidate.name,
      dateOfBirth: currentUser.candidate.dob,
      address: currentUser.candidate.address,
      phone: currentUser.candidate.phone,
      gender: currentUser.candidate.gender,
      image: currentUser.candidate.image,
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Please input your name'),
      dateOfBirth: Yup.string().required('Please input your date of birth'),
      address: Yup.string().required('Please input your address'),
      phone: Yup.string().required('Please input your phone number').matches(/^[0-9\-\\+]{10}$/, 'This phone number is invalid'),
    }),
    onSubmit: async (values) => {
      if (fileImage !== null) {
        const imageRef = ref(storage, `candidate-avatar/${fileImage.name + uuidv4()}`)
        await uploadBytes(imageRef, fileImage).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(url => {
            values.image = url
          })
        })
      }
      console.log('RRRRRRR', values);
      updateProfileCandidate(currentUser.candidate.id, currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Edit profile successfully') : toast.error('Edit profile fail')
      })
    }
  })

  return (
    <React.Fragment>
      <div className="form-group px-2 py-2">
        <form onSubmit={formik.handleSubmit}>
          <div className='inline-flex w-full h-40'>
            <div className='my-3 mx-2 w-2/6'>
              <label className='text-lg'>Email</label><br />
              <div className='field-input'>
                <input type={'text'} className={`form-control border-none `} name='email' value={currentUser.email} disabled /><br />
              </div>
              {formik.errors.email && formik.touched.email && (
                <div className='text-[#ec5555]'>{formik.errors.email}</div>
              )}
            </div>
            <div className='my-3 mx-2 w-2/6'>
              <label className='text-lg'>Fullname: </label><br />
              <div className='field-input'>
                <input type={'text'} className={`form-control border-none ${formik.errors.fullname && formik.touched.fullname && 'input-error'}`} name='fullname' placeholder='Nhập tên của bạn' value={formik.values.fullname} onChange={formik.handleChange} /><br />
              </div>
              {formik.errors.fullname && formik.touched.fullname && (
                <div className='text-[#ec5555]'>{formik.errors.fullname}</div>
              )}
            </div>
            <div className='my-3 mx-2 w-2/6'>
              <div className='edit-profile__image'>
                <img src={currentUser.candidate.image} alt="avatar" width={'150rem'} />
              </div>
              <div>
                <input type={'file'} className='form-control border-none text-sm' name='image' onChange={(e) => { setFileImage(e.target.files[0]) }} /><br />
              </div>
            </div>
          </div>
          <div className='inline-flex w-full'>
            <div className='my-3 mx-2 w-2/6'>
              <label className='text-lg'>Ngày sinh</label><br />
              <div className='field-input'>
                <input type={'date'} className={`form-control border-none ${formik.errors.dateOfBirth && formik.touched.dateOfBirth && 'input-error'}`} name='dateOfBirth' value={formik.values.dateOfBirth} onChange={formik.handleChange} /><br />
              </div>
              {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                <div className='text-[#ec5555]'>{formik.errors.dateOfBirth}</div>
              )}
            </div>
            <div className='my-3 mx-2 w-3/6'>
              <label className='text-lg'>Phone</label><br />
              <div className='field-input'>
                <input type={'text'} className={`form-control border-none ${formik.errors.phone && formik.touched.phone && 'input-error'}`} name='phone' placeholder='Nhập số điện thoại của bạn' value={formik.values.phone} onChange={formik.handleChange} /><br />
              </div>
              {formik.errors.phone && formik.touched.phone && (
                <div className='text-[#ec5555]'>{formik.errors.phone}</div>
              )}
            </div>
            <div className='my-3 mx-2 w-1/6'>
              <label className='text-lg'>Gender</label><br />
              <div className='field-input'>
                <select name='gender' value={formik.values.gender} onChange={formik.handleChange} className='pt-1'>
                  <option>Choose...</option>
                  <option value={'Male'}>Male</option>
                  <option value={'Female'}>Female</option>
                  <option value={'Other'}>Other</option>
                </select>
              </div>
              {formik.errors.phone && formik.touched.phone && (
                <div className='text-[#ec5555]'>{formik.errors.phone}</div>
              )}
            </div>
          </div>
          <div className='my-3 mx-2'>
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
      <ToastContainer />
    </React.Fragment>
  )
}

export default EditInformation
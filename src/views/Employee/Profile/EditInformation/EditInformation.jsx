import React, { useState } from 'react'
import './EditInformation.scss'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuid } from 'uuid';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {editProfileEmployee} from '../../../../apis/employeeApi'
import defaultImage from "../../../../assets/image/defaultUser.png"
import { storage } from '../../../../configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Autocomplete, TextField, Avatar } from '@mui/material';
import { genderData } from '../../../../utils/dropdownData';
import { editSuccess } from '../../../../redux/authSlice';
import ReactLoading from 'react-loading'

const EditInformation = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [fileImage, setFileImage] = useState(null)
  const [isEditing, setIsEditting] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullname: currentUser.employee.name,
      dateOfBirth: currentUser.employee.dob.slice(0, 10),
      address: currentUser.employee.address,
      phone: currentUser.employee.phone,
      gender: currentUser.employee.gender,
      image: currentUser.employee.image,
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Please input your name'),
      dateOfBirth: Yup.string().required('Please input your date of birth'),
      address: Yup.string().required('Please input your address'),
      phone: Yup.string().required('Please input your phone number').matches(/^[0-9\-\\+]{10}$/, 'This phone number is invalid'),
    }),
    onSubmit: async (values) => {
      setIsEditting(true)
      if (fileImage != null) {
        console.log('check1');
        const imageRef = ref(storage, `candidate-avatar/${fileImage.name + uuid()}`)
        await uploadBytes(imageRef, fileImage).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(url => {
            formik.values.image = url
            console.log('1', url);
            console.log('2', formik.values.image);
          })
        })
      }      
      console.log('check2');
      await editProfileEmployee(currentUser.employee.id, currentUser.token, values, dispatch, navigate).then((response) => {
        if (response.data) {
          toast.success('Edit profile successfully')
          dispatch(editSuccess(response.data))
        } else {
          toast.error('Edit profile fail')
        }
      })
      setIsEditting(false)
    }
  })

  return (
    <React.Fragment>
      <div className="editInformation-container">
        <form onSubmit={formik.handleSubmit}>
          <div className='flex my-3 mx-2 justify-between'>
            <div className='w-[30%]'>
              <label className='text-lg'>Email</label>
              <div className='field-input bg-slate-200'>
                <input type={'text'} className={'input-tag focus:outline-none bg-slate-200'} name='email' value={currentUser.email} disabled />
              </div>
              {formik.errors.email && formik.touched.email && (
                <div className='text-[#ec5555]'>{formik.errors.email}</div>
              )}
            </div>
            <div className='w-[30%]'>
              <label className='text-lg'>Họ tên: </label>
              <div className='field-input'>
                <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.fullname && formik.touched.fullname && 'input-error'}`} name='fullname' placeholder='Nhập tên của bạn' value={formik.values.fullname} onChange={formik.handleChange} />
              </div>
              {formik.errors.fullname && formik.touched.fullname && (
                <div className='text-[#ec5555]'>{formik.errors.fullname}</div>
              )}
            </div>
            <div className=''>
              <Avatar src={currentUser.employee.image || defaultImage} alt="avatar" sx={{ width: '10rem', height: '10rem', margin: '0 auto' }} />
              <input type={'file'} className='text-sm mx-auto' name='image' onChange={(e) => { setFileImage(e.target.files[0]) }} />
            </div>
          </div>
          <div className='flex my-3 mx-2 justify-between'>
            <div className='w-[20%]'>
              <label className='text-lg'>Ngày sinh</label>
              <div className='field-input'>
                <input type={'date'} className={`input-tag focus:outline-none ${formik.errors.dateOfBirth && formik.touched.dateOfBirth && 'input-error'}`} name='dateOfBirth' value={formik.values.dateOfBirth} onChange={formik.handleChange} />
              </div>
              {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                <div className='text-[#ec5555]'>{formik.errors.dateOfBirth}</div>
              )}
            </div>
            <div className='w-[30%]'>
              <label className='text-lg'>Số điện thoại</label>
              <div className='field-input'>
                <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.phone && formik.touched.phone && 'input-error'}`} name='phone' placeholder='Nhập số điện thoại của bạn' value={formik.values.phone} onChange={formik.handleChange} /><br />
              </div>
              {formik.errors.phone && formik.touched.phone && (
                <div className='text-[#ec5555]'>{formik.errors.phone}</div>
              )}
            </div>
            <div className='mt-4'>
              <Autocomplete
                name='gender'
                options={genderData()}
                value={formik.values.gender}
                size={'small'}
                sx={{ width: 135, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="Giới tính" />}
                onChange={(event, value) => { formik.setFieldValue('gender', value) }}
              />
            </div>
          </div>
          <div className='my-3 mx-2'>
            <label className='text-lg'>Địa chỉ</label>
            <div className='field-input'>
              <input type={'text'} className={`input-tag focus:outline-none ${formik.errors.address && formik.touched.address && 'input-error'}`} name='address' placeholder='Nhập địa chỉ của bạn' value={formik.values.address} onChange={formik.handleChange} />
            </div>
            {formik.errors.address && formik.touched.address && (
              <div className='text-[#ec5555]'>{formik.errors.address}</div>
            )}
          </div>
          <div className='flex'>
            <button type='submit' className='btn-save-edit'>Save</button>
            {isEditing && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
          </div>
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
    </React.Fragment>
  )
}

export default EditInformation
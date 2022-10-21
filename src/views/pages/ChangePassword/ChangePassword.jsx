import React, { useState } from 'react'
import './ChangePassword.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import defaultImage from "../../../assets/image/defaultUser.png"
import { changePassword } from '../../../apis/authApi'
import { responseStatus } from '../../../utils/constants'

const ChangePassword = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser.data)

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [changePasswordStatus, setChangePasswordStatus] = useState('START')

  const formik = useFormik({
    initialValues: {
      email: currentUser.email,
      oldPassword: "",
      newPassword: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Please input your current password').min(8, "Password must be 8 -20 characters").max(20, "Password must be 8 -20 characters"),
      newPassword: Yup.string().required('Please input new password').min(8, "Password must be 8 -20 characters").max(20, "Password must be 8 -20 characters"),
      confirm: Yup.string().required('Please input confirm password').oneOf([Yup.ref("newPassword"), null], 'Not match'),
    }),
    onSubmit: (values) => {
      changePassword(currentUser.email, values.newPassword, values.oldPassword).then((response) => { console.log(response);
        response.status === 200 ? setChangePasswordStatus(responseStatus.SUCCESS) : setChangePasswordStatus(responseStatus.FAILURE)
      })
    }
  })

  return (
    <div className='change-password-container grid grid-cols-2'>
      <div className="left-container">
        <img src={currentUser.candidate.image || defaultImage} alt='User' width={'150rem'} height={'150rem'} className='mx-auto my-3 rounded-full' />
        <div>
          <span>Name: </span>
          <span>{currentUser.candidate.name} </span>
        </div>
        <div>
          <span>Phone number: </span>
          <span>{currentUser.candidate.phone} </span>
        </div>
        <div>
          <span>Address: </span>
          <span>{currentUser.candidate.address} </span>
        </div>
        <div>
          <span>Status: </span>
          <span>{currentUser.candidate.status} </span>
        </div>
      </div>
      <div className="right-container">
        <div className='form-change-password'>
          <span className='text-2xl'>Thay đổi mật khẩu</span>
          <form onSubmit={formik.handleSubmit}>
            <div className='my-3'>
              <label className='text-lg'>Email</label><br />
              <div className='field-input'>
                <i className="fa-solid fa-envelope mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                <input type={'text'} className={`form-control  border-none `} name='email' value={currentUser.email} onChange={formik.handleChange} disabled /><br />
              </div>
            </div>
            <div className='my-3'>
              <label className='text-lg'>Current password</label><br />
              <div className='field-input'>
                <i className="fa-solid fa-lock mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                <input type={isShowPassword ? 'text' : 'password'} className={`form-control  border-none ${formik.errors.oldPassword && formik.touched.oldPassword && 'input-error'}`} name='oldPassword' placeholder='Nhập mật khẩu hiện tại' value={formik.values.oldPassword} onChange={formik.handleChange} />
                <span className='hideShowPassword' onClick={() => { setIsShowPassword(!isShowPassword) }}>
                  <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                </span>
              </div>
              {formik.errors.oldPassword && formik.touched.oldPassword && (
                <div className='text-[#ec5555]'>{formik.errors.oldPassword}</div>
              )}
            </div>
            <div className='my-3'>
              <label className='text-lg'>New password</label><br />
              <div className='field-input'>
                <i className="fa-solid fa-lock mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                <input type={isShowPassword ? 'text' : 'password'} className={`form-control  border-none ${formik.errors.newPassword && formik.touched.newPassword && 'input-error'}`} name='newPassword' placeholder='Nhập mật khẩu mới' value={formik.values.newPassword} onChange={formik.handleChange} />
                <span className='hideShowPassword' onClick={() => { setIsShowPassword(!isShowPassword) }}>
                  <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                </span>
              </div>
              {formik.errors.newPassword && formik.touched.newPassword && (
                <div className='text-[#ec5555]'>{formik.errors.newPassword}</div>
              )}
            </div>
            <div className='my-3'>
              <label className='text-lg'>Confirm</label><br />
              <div className='field-input'>
                <i className="fa-solid fa-lock mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                <input type={isShowPassword ? 'text' : 'password'} className={`form-control  border-none ${formik.errors.confirm && formik.touched.confirm && 'input-error'}`} name='confirm' placeholder='Nhập lại mật khẩu' value={formik.values.confirm} onChange={formik.handleChange} />
                <span className='hideShowPassword' onClick={() => { setIsShowPassword(!isShowPassword) }}>
                  <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                </span>
              </div>
              {formik.errors.confirm && formik.touched.confirm && (
                <div className='text-[#ec5555]'>{formik.errors.confirm}</div>
              )}
            </div>
            {changePasswordStatus === responseStatus.SUCCESS && <div className='input-success p-2 rounded'>Thay đổi mật khẩu thành công</div>}
              {changePasswordStatus === responseStatus.FAILURE && <div className='input-error p-2 rounded'>Thay đổi mật khẩu thất bại</div>}
            <button type='submit' className='btn-change-password'>Đổi mật khẩu</button>
          </form>
        </div>
      </div>

    </div>

  )
}

export default ChangePassword
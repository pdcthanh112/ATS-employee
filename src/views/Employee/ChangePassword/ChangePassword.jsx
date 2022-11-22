import React, { useState } from 'react'
import './ChangePassword.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { changePassword } from '../../../apis/authApi'
import { responseStatus } from '../../../utils/constants'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [isShowPassword, setIsShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: currentUser.employee.email,
      oldPassword: "",
      newPassword: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Please input your current password').min(8, "Password must be 8 -20 characters").max(20, "Password must be 8 -20 characters"),
      newPassword: Yup.string().required('Please input new password').min(8, "Password must be 8 -20 characters").max(20, "Password must be 8 -20 characters"),
      confirm: Yup.string().required('Please input confirm password').oneOf([Yup.ref("newPassword"), null], 'Not match'),
    }),
    onSubmit: async (values) => {
      await changePassword(currentUser.email, values.newPassword, values.oldPassword).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Thay đổi mật khẩu thành công') : toast.error('Thay đổi mật khẩu thất bại')
      })
    }
  })

  return (
    <React.Fragment>
      <div className='change-password-container'>
        <div className="bg-white h-12 font-bold text-2xl mb-3 rounded-md pt-2 px-4">Change password</div>
        <div className='form-change-password'>
          <form onSubmit={formik.handleSubmit}>
            <div className='my-3'>
              <label className='text-lg'>Email</label><br />
              <div className='field-input'>
                <i className="fa-solid fa-envelope mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                <input type={'text'} className={'input-tag'} name='email' value={currentUser.email} onChange={formik.handleChange} disabled /><br />
              </div>
            </div>
            <div className='my-3'>
              <label className='text-lg'>Current password</label><br />
              <div className='field-input'>
                <i className="fa-solid fa-lock mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                <input type={isShowPassword ? 'text' : 'password'} className={`input-tag focus:outline-none ${formik.errors.oldPassword && formik.touched.oldPassword && 'input-error'}`} name='oldPassword' placeholder='Nhập mật khẩu hiện tại' value={formik.values.oldPassword} onChange={formik.handleChange} />
                <span className=' my-auto mr-2' onClick={() => { setIsShowPassword(!isShowPassword) }}>
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
                <input type={isShowPassword ? 'text' : 'password'} className={`input-tag focus:outline-none ${formik.errors.newPassword && formik.touched.newPassword && 'input-error'}`} name='newPassword' placeholder='Nhập mật khẩu mới' value={formik.values.newPassword} onChange={formik.handleChange} />
                <span className=' my-auto mr-2' onClick={() => { setIsShowPassword(!isShowPassword) }}>
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
                <input type={isShowPassword ? 'text' : 'password'} className={`input-tag focus:outline-none ${formik.errors.confirm && formik.touched.confirm && 'input-error'}`} name='confirm' placeholder='Nhập lại mật khẩu' value={formik.values.confirm} onChange={formik.handleChange} />
                <span className=' my-auto mr-2' onClick={() => { setIsShowPassword(!isShowPassword) }}>
                  <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                </span>
              </div>
              {formik.errors.confirm && formik.touched.confirm && (
                <div className='text-[#ec5555]'>{formik.errors.confirm}</div>
              )}
            </div>

            <button className='btn-change-password'>Change password</button>
          </form>
        </div>
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

export default ChangePassword
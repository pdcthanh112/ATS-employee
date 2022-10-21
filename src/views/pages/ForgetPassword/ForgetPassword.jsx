import React, { useState } from 'react'
import './ForgetPassword.scss'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import headerLogo from '../../../assets/image/big-logo.png'
import loginpageImage from '../../../assets/image/loginpage-image.png'
import { forgetPassword } from '../../../apis/authApi'
import { responseStatus } from '../../../utils/constants'

const ForgetPassword = () => {

  const [resetStatus, setResetStatus] = useState('');

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please input email'),
    }),
    onSubmit: (values) => {
      forgetPassword(values.email).then(response => {
        if (response.status === 200) {
          setResetStatus(responseStatus.SUCCESS)
        } else if (response.response.data.status === responseStatus.FAILURE) {
          setResetStatus(responseStatus.FAILURE)
        }
      })
    }
  })

  return (
    <div className='login-container grid grid-cols-2'>
      <div className='login-left'>
        <img src={loginpageImage} alt='Logo' width={500} height={200} className='loginpage-image' />
      </div>
      <div className='login-right'>
        <div className='right-container'>
          <a href="#/dashboard"><img src={headerLogo} alt='Logo' width={200} height={70} /></a>
          <div className='my-2 font-sans font-semibold leading-6 text-slate-900 text-lg'>Quên mật khẩu</div>
          <div className='login-form form-group'>
            <form onSubmit={formik.handleSubmit}>
              <div className='my-4'>
                <label className='text-lg'>Email</label><br />
                <div className='field-input'>
                  <i className="fa-solid fa-envelope mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                  <input type={'text'} className='form-control border-none' name='email' placeholder='Nhập email của bạn' value={formik.values.email} onChange={formik.handleChange} /><br />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <div className='text-[#ec5555]'>{formik.errors.email}</div>
                )}
              </div>
              {resetStatus === responseStatus.SUCCESS && <div className='input-success p-2 rounded'>Yêu cầu lấy lại mật khẩu được thực hiện thành công. Vui lòng kiểm tra email của bạn để được hướng dẫn</div>}
              {resetStatus === responseStatus.FAILURE && <div className='input-error p-2 rounded'>Email không tồn tại</div>}
              <button type='submit' className='btn-login'>Đổi mật khẩu</button>
            </form>
            <div className='my-4'>
              <span>Bạn chưa có tài khoản? </span><a href='#/register' style={{ color: "#116835" }}>Đăng ký ngay</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
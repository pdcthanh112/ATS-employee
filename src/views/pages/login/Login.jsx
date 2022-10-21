import React, { useState } from 'react'
import './Login.scss'
import headerLogo from '../../../assets/image/big-logo.png'
import loginpageImage from '../../../assets/image/loginpage-image.png'

import { loginUser } from '../../../apis/authApi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'

const Login = () => {

  const [isShowPassword, setIsShowPassword] = useState(false)

  const loginError = useSelector((state) => state.auth.login.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleHideShowPassword = () => {
    setIsShowPassword(!isShowPassword)
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please input email'),
      password: Yup.string().required('Please input password'),
    }),
    onSubmit: (values) => {
      loginUser(values, dispatch, navigate)  
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
          <div className='my-2 font-sans font-semibold leading-6 text-slate-900 text-lg'>Chào mừng bạn đến với hệ thống tuyển dụng CK HR Consulting của chúng tôi</div>
          <span className='my-2 font-sans font-light text-slate-400'>Hãy đăng nhập để có thể sử dụng những dịch vụ của chúng tôi</span>
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
              <div className='form-group my-4'>
                <label className='text-lg'>Password</label><br />
                <div className='field-input'>
                  <i className="fa-solid fa-lock mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                  <input type={isShowPassword ? 'text' : 'password'} className='form-control border-none' name='password' placeholder='Nhập mật khẩu' value={formik.values.password} onChange={formik.handleChange} />
                  <span className='hideShowPassword' onClick={() => { handleHideShowPassword() }}>
                    <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                  </span>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <div className='text-[#ec5555]'>{formik.errors.password}</div>
                )}
              </div>
              {loginError && <div className='input-error p-2 rounded'>Incorrect email or password</div>}
              <div className='my-4'>
                <a href="/#/forget-password" style={{ marginLeft: '20rem' }}>Quên mật khẩu</a>
              </div>
              <button type='submit' className='btn-login'>Đăng nhập</button>
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

export default Login

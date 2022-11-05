import React, { useState } from 'react'
import './Login.scss'
import headerLogo from '../../../assets/image/big-logo.png'
import loginpageImage from '../../../assets/image/loginpage-image.png'

import { loginUser } from '../../../apis/authApi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import ReactLoading from 'react-loading'

const Login = () => {

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      setIsLoading(true)
      loginUser(values, dispatch, navigate).then(() => setIsLoading(false))
    }
  })

  return (
    <div className='login-container'>
      <div className='rectange'></div>
      <a href="#/dashboard" ><img src={headerLogo} alt='Logo' width={200} height={70} className='ml-24 pt-3' /></a>

      <div className='login-form form-group'>
        <div className='font-semibold text-2xl font-mono'>Welcome to CK HR Consulting</div>
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
              <span className='hideShowPassword mx-3 my-auto' onClick={() => { handleHideShowPassword() }}>
                <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
              </span>
            </div>
            {formik.errors.password && formik.touched.password && (
              <div className='text-[#ec5555]'>{formik.errors.password}</div>
            )}
          </div>
          {loginError && <div className='input-error p-2 rounded'>Tên đăng nhập hoặc mật khẩu không chính xác</div>}
          <div className='my-4'>
            <a href="/#/forget-password" style={{ marginLeft: '17rem' }}>Quên mật khẩu</a>
          </div>
          <div className='flex'>
                <button type='submit' className='btn-login'>Đăng nhập</button>
                {isLoading && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
              </div>
        </form>
      </div>
    </div>
  )
}

export default Login
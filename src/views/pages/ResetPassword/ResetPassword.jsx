import React, { useState } from 'react'
import './ResetPassword.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import headerLogo from '../../../assets/image/big-logo.png'
import loginpageImage from '../../../assets/image/loginpage-image.png'
import { resetPassword } from '../../../apis/authApi'
import { responseStatus } from '../../../utils/constants'

const ResetPassword = () => {

  const { email, token } = useParams()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [resetPasswordStatus, setResetPasswordStatus] = useState('START')

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Please input password').min(8, "Password must be 8 -20 characters").max(20, "Password must be 8 -20 characters"),
      confirm: Yup.string().required('Please input confirm password').oneOf([Yup.ref("password"), null], 'Not match'),
    }),
    onSubmit: (values) => {
      resetPassword(email, values.password, token).then((response) => {
        response.status === 200 ? setResetPasswordStatus(responseStatus.SUCCESS) : setResetPasswordStatus(responseStatus.FAILURE)
      })
    }
  })


  return (
    <div className='register-container grid grid-cols-2'>
      <div className='register-left'>
        <div className='left-container'>
          <a href="#/dashboard"><img src={headerLogo} alt='Logo' width={200} height={70} className='registerpage-image' /></a>
          <div className='my-2 font-sans font-semibold leading-6 text-slate-900 text-lg'>Tạo lại mật khẩu của bạn</div>
          <span className='my-2 font-sans font-light text-slate-400'>Đăng nhập ngay để bắt đầu xây dựng một hồ sơ nổi bật cho bạn và nhận được các cơ hội sự nghiệp lý tưởng</span>
          <div className='register-form form-group'>
            <form onSubmit={formik.handleSubmit}>
              <div className='my-3'>
                <label className='text-lg'>Password</label><br />
                <div className='field-input'>
                  <i className="fa-solid fa-lock mx-2 my-auto" style={{ color: "#116835", fontSize: '22px' }}></i>
                  <input type={isShowPassword ? 'text' : 'password'} className={`form-control  border-none ${formik.errors.password && formik.touched.password && 'input-error'}`} name='password' placeholder='Nhập mật khẩu' value={formik.values.password} onChange={formik.handleChange} />
                  <span className='hideShowPassword' onClick={() => { setIsShowPassword(!isShowPassword) }}>
                    <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                  </span>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <div className='text-[#ec5555]'>{formik.errors.password}</div>
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
              {resetPasswordStatus === responseStatus.SUCCESS && <div className='input-success p-2 rounded'>Lưu mật khẩu thành công</div>}
              {resetPasswordStatus === responseStatus.FAILURE && <div className='input-error p-2 rounded'>Reset mật khẩu thất bại</div>}
              <button type='submit' className='btn-register'>Lưu mật khẩu</button>
            </form>
            <div className='my-2 inline-flex w-full justify-between'>
              <a href='#/login' style={{ color: "#116835", fontWeight: "500", fontSize: '1.2rem'}}>Quay lại đăng nhập?</a>
              <a href='#/register' style={{ color: "#116835", fontWeight: "500", fontSize: '1.2rem'}}>Đăng ký tài khoản mới?</a>
            </div>
          </div>
        </div>
      </div>
      <div className='register-right'>
        <img src={loginpageImage} alt='Logo' width={500} height={200} className='registerpage-image' />
      </div>
    </div>
  )
}

export default ResetPassword
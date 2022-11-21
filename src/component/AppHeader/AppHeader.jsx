import React from "react";
import './AppHeader.scss'

import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../apis/authApi'
import { Avatar } from '@mui/material'
import logo from '../../assets/image/big-logo.png'
import defaultUser from '../../assets/image/defaultUser.png'
import NotificationIcon from '../../assets/icon/notification-icon.png'
import { Badge } from "@material-ui/core";

const AppHeader = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser(dispatch, navigate)
  }

  return (
    <div className="header-container">
      <a href="/#/dashboard"><img src={logo} alt='' width={'180rem'} className='ml-10' /></a>

      <div className="flex w-[25%]">
        <Badge badgeContent={4} color="primary">
          <img src={NotificationIcon} alt="" width={'40rem'} style={{borderRadius: '50%'}}/>
        </Badge>

        <div className='header-menu'>
          <div className="dropdown">
            <a className="" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <div className='inline-flex rounded-3xl px-2' style={{ border: '1px solid #60d860' }}>
                <Avatar src={currentUser.image || defaultUser} alt='' className='my-auto' />
                <div className='mx-2 py-2.5 font-medium text-lg' style={{ width: '13rem' }}>{currentUser.employee.name}</div>
                <i className="fa-solid fa-chevron-down m-1.5 py-2.5 text-xs"></i>
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu_header">
              <a href='/#/manage-profile/view-profile'><div className='header-menu-item'><i className="fa-regular fa-address-card mr-2 text-[#60d860]"></i>Thông tin cá nhân</div></a>
              <a href='/#/manage-profile/change-password'><div className='header-menu-item'><i className="fa-sharp fa-solid fa-shield-halved mr-2 text-[#60d860]"></i>Thay đổi mật khẩu</div></a>
              <Link to='/#/logout' onClick={handleLogout}><div className='header-menu-item hover:text-[#000]' style={{ marginTop: 15, marginBottom: 10 }}><i className="fa-solid fa-arrow-right-from-bracket mr-2 text-[#ff5858] "></i>Đăng xuất</div></Link>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AppHeader;

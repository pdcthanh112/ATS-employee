import React from 'react'
import './AppSidebar.scss'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import ckhrLogo from '../../assets/brand/ckhr-logo.png'

import SimpleBar from 'simplebar-react'
//import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from './_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => { dispatch({ type: 'set', sidebarShow: visible }) }}
      color='#000'
    >
      <CSidebarBrand className="d-none d-md-flex" to="/" style={{ backgroundColor: '#fff' }}>
        <img src={ckhrLogo} alt="Logo" width={'120px'} height={'30px'} />
      </CSidebarBrand>
      <div className='sidebar-item'>
        <CSidebarNav>
          <SimpleBar>
            <AppSidebarNav items={navigation} />
          </SimpleBar>
        </CSidebarNav>
      </div>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

import React from 'react'
import AppContent from '../component/AppContent/AppContent'
import AppHeader from '../component/AppHeader/AppHeader'
import AppSidebar from '../component/AppSidebar/AppSidebar'
//import AppFooter from '../component/AppFooter/AppFooter'
import { store } from "../redux/store";

const currentUser = store.getState().auth.login.currentUser;

function DefaultLayout() {

  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <AppHeader />
      <div className="inline-flex">
        <AppSidebar />
        <div style={{ width: '82%', paddingBottom: '2rem' }}>
          <div className='flex justify-end px-5 pt-3 font-medium text-xl'>Department: {currentUser.employee.department.name}</div>
          <AppContent />
        </div>
      </div>
      {/* <AppFooter /> */}
    </div>
  )
}

export default DefaultLayout
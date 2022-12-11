import React from 'react'
import AppContent from '../component/AppContent/AppContent'
import AppHeader from '../component/AppHeader/AppHeader'
import AppSidebar from '../component/AppSidebar/AppSidebar'
//import AppFooter from '../component/AppFooter/AppFooter'

function DefaultLayout() {
  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <AppHeader />
      <div className="inline-flex">
        <AppSidebar />
        <div style={{ width: '82%', paddingBottom: '2rem' }}>
          <AppContent />
        </div>
      </div>
      {/* <AppFooter /> */}
    </div>
  )
}

export default DefaultLayout
import React from 'react'
import AppContent from '../component/AppContent/AppContent'
import AppFooter from '../component/AppFooter/AppFooter'
import AppHeader from '../component/AppHeader/AppHeader'
import AppSidebar from '../component/AppSidebar/AppSidebar'

function DefaultLayout() {
  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <AppHeader />
      <div className="bg-neutral-200 inline-flex">
        <AppSidebar />
        <div style={{ width: '84%' }}>
          <AppContent />
        </div>
      </div>
      <AppFooter />
    </div>
  )
}

export default DefaultLayout
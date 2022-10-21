import React from 'react'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CandidatePage = React.lazy(() => import('./views/Candidate/CandidatePage/CandidatePage'))
// const ChangePassword = React.lazy(() => import('./views/pages/ChangePassword/ChangePassword'))
// const RecruitmentDetail = React.lazy(() => import('./views/Recuirment/recruitmentDetail/RecruitmentDetail'))
// const ForgetPassword = React.lazy(() => import('./views/pages/ForgetPassword/ForgetPassword')) 
// const ResetPassword = React.lazy(() => import('./views/pages/ResetPassword/ResetPassword')) 

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/candidate', name: 'Candidate Page', element: CandidatePage },
  // { path: '/recruitment-detail/:id', name: 'Recruitment Detail', element: RecruitmentDetail },
  // { path: '/change-password', name: 'Change Password', element: ChangePassword },
  // { path: '/forget-password', name: 'Forget Password', element: ForgetPassword },
  // { path: '/reset-password/:email/:token', name: 'Reset Password', element: ResetPassword },
  
]

export default routes

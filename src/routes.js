import React from 'react'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CandidatePage = React.lazy(() => import('./views/Candidate/CandidatePage/CandidatePage'))
const RecruitmentRequestPage = React.lazy(() => import('./views/Recuirment/RecruitmentRequest/RecruitmentRequestPage/RecruitmentRequestPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/candidate', name: 'Candidate Page', element: CandidatePage },
  { path: '/recruitment-request', name: 'Recruitment Request Page', element: RecruitmentRequestPage },
 
  
]

export default routes

import React from 'react'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CandidatePage = React.lazy(() => import('./views/Candidate/CandidatePage/CandidatePage'))
const RecruitmentPlanPage = React.lazy(() => import('./views/Recuirment/RecruitmentPlan/RecruitmentPlanPage/RecruitmentPlanPage'))
const PlanDetailPage = React.lazy(() => import('./views/Recuirment/PlanDetail/PlanDetailPage/PlanDetailPage'))
const RecruitmentRequestPage = React.lazy(() => import('./views/Recuirment/RecruitmentRequest/RecruitmentRequestPage/RecruitmentRequestPage'))
const SchedulePage = React.lazy(() => import('./views/Schedule/SchedulePage/SchedulePage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/candidate', name: 'Candidate Page', element: CandidatePage },
  { path: '/recruitment-plan', name: 'Recruitment Request Page', element: RecruitmentPlanPage },
  { path: '/plan-detail', name: 'Recruitment Plan Detail Page', element: PlanDetailPage },
  { path: '/recruitment-request', name: 'Recruitment Request Page', element: RecruitmentRequestPage },
  { path: '/schedules', name: 'Schedule Page', element: SchedulePage },
 
  
]

export default routes

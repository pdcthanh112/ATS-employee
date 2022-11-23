import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CandidatePage = React.lazy(() => import('./views/Candidate/CandidatePage/CandidatePage'))
const RecruitmentPlanPage = React.lazy(() => import('./views/Recuirment/RecruitmentPlan/RecruitmentPlanPage/RecruitmentPlanPage'))
const PlanDetailPage = React.lazy(() => import('./views/Recuirment/PlanDetail/PlanDetailPage/PlanDetailPage'))
const RecruitmentRequestPage = React.lazy(() => import('./views/Recuirment/RecruitmentRequest/RecruitmentRequestPage/RecruitmentRequestPage'))
const InterviewSchedulePage = React.lazy(() => import('./views/Interview/InterviewSchedule/InterviewSchedulePage/InterviewSchedulePage'))
const InterviewDetailPage = React.lazy(() => import('./views/Interview/InterviewDetail/InterviewDetailPage/InterviewDetailPage'))
const DepartmentInterviewPage = React.lazy(() => import('./views/Interview/DepartmentInterview/DepartmentInterview'))
const CuriculumVitaePage = React.lazy(() => import('./views/CuriculumVitae/CVPage/CVPage'))
const JobApplyPage = React.lazy(() => import('./views/JobApply/JobApplyPage/JobApplyPage'))
const ViewJobApplyPage = React.lazy(() => import('./views/JobApply/ViewJobApply/ViewJobApply'))
const NotificationPage = React.lazy(() => import('./views/Notification/NotificationPage/NotificationPage'))
const ChangePasswordPage = React.lazy(() => import('./views/Employee/ChangePassword/ChangePassword'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/candidate', name: 'Candidate Page', element: CandidatePage },
  { path: '/recruitment-plan', name: 'Recruitment Request Page', element: RecruitmentPlanPage },
  { path: '/plan-detail', name: 'Recruitment Plan Detail Page', element: PlanDetailPage },
  { path: '/recruitment-request', name: 'Recruitment Request Page', element: RecruitmentRequestPage },
  { path: '/interview-schedule', name: 'Interview Schedule Page', element: InterviewSchedulePage },
  { path: '/interview-detail', name: 'Interview Detail Page', element: InterviewDetailPage },
  { path: '/department-interview/:id', name: 'Department Interview Page', element: DepartmentInterviewPage },
  { path: '/curiculum-vitae', name: 'Curiculum Vitae Page', element: CuriculumVitaePage },
  { path: '/job-apply', name: 'Job Apply Page', element: JobApplyPage },
  { path: '/view-job-apply/:id', name: 'View Job Apply Page', element: ViewJobApplyPage },
  { path: '/notification', name: 'Notification Page', element: NotificationPage }, 
  { path: '/change-password', name: 'Notification Page', element: ChangePasswordPage }, 
]

export default routes

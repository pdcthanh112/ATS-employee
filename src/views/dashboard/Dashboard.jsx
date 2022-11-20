import React, { useEffect, useState } from 'react'
import './Dashboard.scss'

import {Link} from 'react-router-dom'
import { getCategory } from '../../apis/recruimentRequestApi';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalStatusDetail } from '../../apis/dashboardApi';

import ApexCharts from 'react-apexcharts'
import ReactLoading from 'react-loading';
import { getEmployeeByDepartment } from '../../apis/employeeApi';
import { getInterviewByEmployee } from '../../apis/interviewScheduleApi';
import InterviewIcon from '../../assets/icon/date-time-icon.png'
import { interviewType } from '../../utils/constants'

import { Avatar } from '@mui/material'

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const dispatch = useDispatch();

  const [recruitmentPlanData, setRecruitmentPlanData] = useState({ dataStatus: [], dataValue: [] })
  const [planDetailData, setPlanDetailData] = useState({ dataStatus: [], dataValue: [] })
  const [recruitmentRequestData, setRecruitmentRequestData] = useState({ dataStatus: [], dataValue: [] })

  const [listColleagues, setListColleagues] = useState([])
  const [listInterview, setListInterview] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getTotalStatusDetail(currentUser.token);
      if (response.data) {
        setRecruitmentPlanData(response.data.countStatusPlan)
        setPlanDetailData(response.data.countStatusDetail)
        setRecruitmentRequestData(response.data.countStatusRequest)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getEmployeeByDepartment(currentUser.token, currentUser.employee.department.id, 0, 5);
      if (response && response.data) {
        setListColleagues(response.data.responseList)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getInterviewByEmployee(currentUser.token, currentUser.employee.department.id, 0, 3);
      if (response && response.data) {
        setListInterview(response.data.responseList)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    getCategory(dispatch)
  }, [])

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div className='w-[90%] mx-auto'>
          <div className='statusChart-container'>
            <div className='statusChart-item'>
              <ApexCharts
                type="donut"
                width={'80%'}
                series={recruitmentPlanData.map((item) => item.total)}
                options={{
                  title: { text: "Recruitment plan" },
                  noData: { text: "Empty Data" },
                  colors: ["#FFC700", "#20D489", "#F1416C"],
                  labels: recruitmentPlanData.map((item) => item.status)
                }}
              />
            </div>
            <div className='statusChart-item'>
              <ApexCharts
                type="donut"
                width={'80%'}
                series={planDetailData.map((item) => item.total)}
                options={{
                  title: { text: "Plan detail" },
                  noData: { text: "Empty Data" },
                  colors: ["#FFC700", "#20D489", "#F1416C"],
                  labels: planDetailData.map((item) => item.status)
                }}
              />
            </div>
            <div className='statusChart-item'>
              <ApexCharts
                type="pie"
                width={'80%'}
                series={recruitmentRequestData.map((item) => item.total)}
                options={{
                  title: { text: "Recruitment request" },
                  noData: { text: "Empty Data" },
                  colors: ["#FFC700", "#20D489", "#F1416C"],
                  labels: recruitmentRequestData.map((item) => item.status)
                }}
              />
            </div>
          </div>

          <div className='flex'>
            <div className='interview-container w-[65%]'>
              <div className='flex justify-between'>
                <div className='font-semibold text-xl'>Interview schedule</div>
                <Link to='/interview-schedule'>See all</Link>
              </div>
              {listInterview && listInterview.map((item) => (
                <div className='interview-item'>
                  <div className='inline-flex justify-between w-[100%]'>
                    <div className='flex'>
                      <div>
                        <div className='font-semibold text-lg'>{item.date}</div>
                        <div className='flex justify-end font-bold text-xl'>{item.time}</div>
                      </div>
                      <div className='ml-4'><img src={InterviewIcon} alt="" width={'50rem'} /></div>
                    </div>
                    <div className='font-semibold text-lg grid justify-end mb-3'>
                      <div>Round: {item.round}</div>
                      <div>
                        {item.type === interviewType.ONLINE ? <span className='bg-[#20D489] text-sm px-4 py-2 rounded-xl'>ONLINE</span> : <span>Room: {item?.room}</span>}
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between mt-2'>
                    <div className='field-item w-[60%]'>{item.candidateName}</div>
                    <div className='field-item w-[30%]'>{item.jobApply.recruitmentRequest.position.name}</div>
                  </div>
                  {item.type === interviewType.ONLINE ? <div className='mt-2'>
                    <div className='font-semibold text-lg'>Google meet</div>
                    <div className='field-item'>{item?.linkMeeting}</div>
                  </div> : <div className='mt-2'>
                    <div className='font-semibold text-lg'>Address</div>
                    <div className='field-item'>{item?.address}</div>
                  </div>}                               
                </div>
              ))}
            </div>

            <div className='colleague-container w-[35%]'>
              <div className='font-medium text-lg flex justify-center mb-3'>Other employees in the department</div>
              {listColleagues && listColleagues.map((item) => (
                <div className='flex my-3'>
                  <Avatar src={item.image} className='mr-3' />
                  <div className='w-full'>
                    <div className='font-medium text-lg'>{item.name}</div>
                    <div className='flex justify-between'>
                      <div>{item.position.name}</div>
                      <div>{item.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  )
}

export default Dashboard



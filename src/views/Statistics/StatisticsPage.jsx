import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { getReport } from '../../apis/statisticsApi'
import StatisticsIcon from '../../assets/icon/monitor.png'
import './StatisticsPage.scss'

const StatisticsPage = () => {

  const [report, setReport] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getReport();
      if (response && response.data) {
        setReport(response.data)
        console.log(response.data);
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  return (
    <div>
      <div className='flex px-8 py-2'>
        <span className='font-medium text-3xl mr-3'>Statistics</span>
        <img src={StatisticsIcon} alt='' width={'40rem'} />
      </div>

      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div className='report-container'>
          <TableContainer component={Paper} sx={{ maxWidth: '90vw', overflowX: 'scroll' }}>
            <Table sx={{}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '3rem' }}>Department</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Recruitment plan</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Plan detail</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Job request</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Source</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Total apply</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Total acceptable CV</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Total join interview</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Total pass interview</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map(departmentItem => (
                  <>
                    <TableRow>
                      <TableCell rowSpan={departmentItem.totalRowByDepartment}>{departmentItem.departmentName}</TableCell>
                    </TableRow>
                    {departmentItem.recruitmentPlans?.map(recruitmentPlanItem => (
                      <>
                        <TableRow>
                          <TableCell rowSpan={recruitmentPlanItem.totalRowByPlan}>PLAN:{recruitmentPlanItem.recruitmentPlanName}</TableCell>
                        </TableRow>
                        {recruitmentPlanItem.planDetails?.map((planDetailItem) => (
                          <>
                            <TableRow>
                              <TableCell rowSpan={planDetailItem.totalRowByPlanDetail}>DETAIL:{planDetailItem.planDetailName}</TableCell>
                            </TableRow>
                            {planDetailItem.jobRequests?.map((requestItem) => (
                              <>
                                <TableRow>
                                  <TableCell rowSpan={requestItem.totalDetailByJobRequest + 1}>REQUEST:{requestItem.recruitmentRequestName}</TableCell>
                                </TableRow>
                                {requestItem.details.map((detailItem) => (
                                  <TableRow>
                                    <TableCell align='center'>{detailItem.totalCV}</TableCell>
                                    <TableCell align='center'>{detailItem.source}</TableCell>
                                    <TableCell align='center'>{detailItem.totalAcceptableCV}</TableCell>
                                    <TableCell align='center'>{detailItem.totalJoinInterview}</TableCell>
                                    <TableCell align='center'>{detailItem.totalPassInterview}</TableCell>
                                  </TableRow>
                                ))}
                              </>
                            ))}
                          </>
                        ))}
                      </>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      }
    </div>
  )
}

export default StatisticsPage


import React, { useState, useEffect } from 'react'
import './StatisticsPage.scss'
import StatisticsIcon from '../../assets/icon/monitor.png'
import { getReport } from '../../apis/statisticsApi'
import ReactLoading from 'react-loading'
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ShowMoreIcon from '../../assets/icon/viewMore.png'
import ShowLessIcon from '../../assets/icon/viewLess.png'

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
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '30%' }}>Department</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Recruitment plan</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Plan detail</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Job request</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total apply</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Source</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total acceptable CV</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total join interview</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total pass interview</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map(departmentItem => (
                  <>
                    <TableRow>
                      <TableCell rowSpan={departmentItem.totalDetailByDepartment + 4}>{departmentItem.departmentName}</TableCell>
                    </TableRow>
                    {departmentItem.recruitmentPlans?.map(recruitmentPlanItem => (
                      <>
                        <TableRow>
                          <TableCell rowSpan={recruitmentPlanItem.totalDetailByPlan + 3}>PLAN:{recruitmentPlanItem.recruitmentPlanName}</TableCell>
                        </TableRow>
                        {recruitmentPlanItem.planDetails?.map((planDetailItem) => (
                          <>
                            <TableRow>
                              <TableCell rowSpan={planDetailItem.totalDetailByPlanDetail + 2}>DETAIL:{planDetailItem.planDetailName}</TableCell>
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


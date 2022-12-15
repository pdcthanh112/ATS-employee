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
                  <TableCell sx={{ width: '10%' }} />
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10%' }}>Department</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Recruitment plan</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Job request</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total apply</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Source</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total acceptable CV</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total join interview</TableCell>
                  <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '50%' }}>Total pass interview</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report?.map((item, id) => (
                  <Row key={id} item={item} />
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


const Row = (props) => {

  const { item } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell align='center' rowSpan={item.recruitmentPlans.length}>{item.departmentName}</TableCell>
        <TableCell align='center' rowSpan={5}>{item.recruitmentPlans.map((planItem) => (
          <TableRow>
            <TableCell align='center'>{planItem.recruitmentPlanName}</TableCell>
            <TableCell align='center'>{planItem.planDetails.map((detailItem) => (
              <TableRow>
                <TableCell align='center'>{detailItem.planDetailName}</TableCell>
                <TableCell align='center'>{detailItem.jobRequests.map((requestItem) => (
                  <TableRow>
                    <TableCell align='center'>{requestItem.source}</TableCell>
                    <TableCell align='center'>{requestItem.details.map((item) => (
                      <TableRow>
                        <TableCell align='center'>{item.totalAcceptableCV}</TableCell>
                        <TableCell align='center'>{item.totalJoinInterview}</TableCell>
                        <TableCell align='center'>{item.totalPassInterview}</TableCell>
                      </TableRow>
                    ))}</TableCell>

                  </TableRow>
                ))}</TableCell>
              </TableRow>
            ))}</TableCell>
          </TableRow>
        ))}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Percentage of candidates passing the screening</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Percentage of candidates passing the interview</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>{(item.totalAcceptableCV / item.totalCV).toFixed(2) * 100}%</TableCell>
                    <TableCell align='center'>{(item.totalPassInterview / item.totalJoinInterview).toFixed(2) * 100}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
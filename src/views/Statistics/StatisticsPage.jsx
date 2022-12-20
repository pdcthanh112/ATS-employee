import React, { useEffect, useState } from 'react'
import './StatisticsPage.scss'
import ReactLoading from 'react-loading'
import { Autocomplete, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { getReport, getYearFromPlan, searchReport } from '../../apis/statisticsApi'
import { getIdAndNameActiveDepartment } from '../../apis/departmentApi'
import StatisticsIcon from '../../assets/icon/monitor.png'
import { useFormik } from 'formik'
import FilterIcon from '../../assets/icon/filter.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StatisticsPage = () => {

  const [report, setReport] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [listDepartment, setListDepartment] = useState([])
  const [listYear, setListYear] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getReport();
      if (response && response.data) {
        setReport(response.data)
      }
      setIsLoading(false)
    }
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await getIdAndNameActiveDepartment().then((response) => {
        if (response && response.data) {
          setListDepartment(response.data)
        }
      })
      await getYearFromPlan().then((response) => {
        if (response && response.data) {
          setListYear(response.data)
        }
      })
    }
    fetchData();
  }, [])

  const formikSearch = useFormik({
    initialValues: {
      departmentName: '',
      year: ''
    },
    onSubmit: async (values) => {
      // await searchReport(values).then((response) => {
      //   if (response && response.data) {
      //     setReport(response.data)
      //   } else {
      //     toast.error('No data')
      //   }
      // })
      console.log(values);
    }
  })


  return (
    <React.Fragment>
      <div>
        <div className='flex px-8 py-2'>
          <span className='font-medium text-3xl mr-3'>Statistics</span>
          <img src={StatisticsIcon} alt='' width={'40rem'} />
        </div>

        <div className='flex justify-end mr-16'>
          <Autocomplete
            id={formikSearch.values.departmentName}
            options={listDepartment}
            size={'small'}
            sx={{ width: 220, marginRight: 2 }}
            getOptionLabel={option => option.name}
            renderInput={(params) => <TextField {...params} label="Department" />}
            onChange={(event, value) => { formikSearch.setFieldValue('departmentName', value.name) }}
          />

          <Autocomplete
            options={listYear}
            size={'small'}
            sx={{ width: 180, marginRight: 2 }}
            renderInput={(params) => <TextField {...params} label="Year" />}
            onChange={(event, value) => { formikSearch.setFieldValue('year', value) }}
          />

          <img src={FilterIcon} alt="" style={{ width: '2.5rem' }} title='Search' className='hover:cursor-pointer' onClick={() => formikSearch.handleSubmit()} />
        </div>

        {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
          <div className='report-container'>
            <TableContainer component={Paper} sx={{ maxWidth: '90vw', maxHeight: '90vh', overflow: 'scroll' }}>
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
                    <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Approved CV rate</TableCell>
                    <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Total join interview</TableCell>
                    <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Total pass interview</TableCell>
                    <TableCell align='center' sx={{ fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Pass interview rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.map(departmentItem => (
                    <>
                      <TableRow>
                        <TableCell rowSpan={departmentItem.totalRowByDepartment} className='khongchoxuonghang' title={departmentItem.departmentName}>{departmentItem.departmentName}</TableCell>
                      </TableRow>
                      {departmentItem.recruitmentPlans?.map(recruitmentPlanItem => (
                        <>
                          <TableRow>
                            <TableCell rowSpan={recruitmentPlanItem.totalRowByPlan} className='khongchoxuonghang' title={recruitmentPlanItem.recruitmentPlanName}>{recruitmentPlanItem.recruitmentPlanName}</TableCell>
                          </TableRow>
                          {recruitmentPlanItem.planDetails?.map((planDetailItem) => (
                            <>
                              <TableRow>
                                <TableCell rowSpan={planDetailItem.totalRowByPlanDetail} className='khongchoxuonghang' title={planDetailItem.planDetailName}>{planDetailItem.planDetailName}</TableCell>
                              </TableRow>
                              {planDetailItem.jobRequests?.map((requestItem) => (
                                <>
                                  <TableRow>
                                    <TableCell rowSpan={requestItem.totalDetailByJobRequest + 1} className='khongchoxuonghang' title={requestItem.recruitmentRequestName}>{requestItem.recruitmentRequestName}</TableCell>
                                  </TableRow>
                                  {requestItem.details.map((detailItem) => {
                                    const passScreeningRate = detailItem.totalCV !== 0 ? (detailItem.totalAcceptableCV / detailItem.totalCV).toFixed(3) * 100 : 0
                                    const passInterviewRate = detailItem.totalJoinInterview !== 0 ? (detailItem.totalPassInterview / detailItem.totalJoinInterview).toFixed(3) * 100 : 0
                                    return (
                                      <TableRow>
                                        <TableCell align='center'>{detailItem.source}</TableCell>
                                        <TableCell align='center'>{detailItem.totalCV}</TableCell>
                                        <TableCell align='center'>{detailItem.totalAcceptableCV}</TableCell>
                                        <TableCell align='center'>{passScreeningRate}%</TableCell>
                                        <TableCell align='center'>{detailItem.totalJoinInterview}</TableCell>
                                        <TableCell align='center'>{detailItem.totalPassInterview}</TableCell>
                                        <TableCell align='center'>{passInterviewRate}%</TableCell>
                                      </TableRow>
                                    )
                                  })}
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  )
}

export default StatisticsPage


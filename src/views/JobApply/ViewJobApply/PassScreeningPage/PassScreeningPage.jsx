import React, { useState } from 'react'

import { Box, Collapse, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useConfirm } from "material-ui-confirm"
import moment from 'moment'
import ReactLoading from 'react-loading'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getJobApplyPassScreening } from '../../../../apis/jobApplyApi'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import cvIcon from '../../../../assets/icon/cv.png'
import ShowLessIcon from '../../../../assets/icon/viewLess.png'
import ShowMoreIcon from '../../../../assets/icon/viewMore.png'
import { useHandleApprovePassScreeningJobApply, useHandleRejectPassScreeningJobApply } from '../hooks'

const PassScreeningPage = () => {

  const recruimentId = useParams().id

  const [pagination, setPagination] = useState({ totalPage: 0, currentPage: 1 })

  const { data: listJobApply, isLoading } = useQuery(['jobApplyPassScreening', pagination], async () => await getJobApplyPassScreening(recruimentId, pagination.currentPage - 1, 5).then((response) => {
    setPagination({ ...pagination, totalPage: response.data.totalPage })
    return response.data.responseList
  }));

  return (
    <React.Fragment>
      {isLoading ? <ReactLoading className='mx-auto my-5' type='spinningBubbles' color='#bfbfbf' /> :
        <div className='listJobApply-container'>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '5%' }} />
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '500', width: '5%' }}>#</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '25%' }}>Candidate</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '20%' }} align='center'>Email</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Date apply</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>CV</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Status</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listJobApply?.map((item, id) => (
                  <Row key={id} ordinalNumbers={id} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className='flex justify-center bg-[#FFF]'>
            <Stack spacing={2}>
              <Pagination count={pagination.totalPage} onChange={(event, page) => { setPagination({ ...pagination, currentPage: page }) }} />
            </Stack>
          </div>
        </div>
      }
    </React.Fragment>
  )
}

export default PassScreeningPage

const Row = (props) => {

  const { ordinalNumbers, item } = props;
  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const { mutate: handleApproveJobApply } = useHandleApprovePassScreeningJobApply();
  const { mutate: handleRejectJobApply } = useHandleRejectPassScreeningJobApply();

  const approveJobApply = async (id) => {
    await confirm({ description: "Are you sure to aprrove this candidate?" }).then(() => {
      handleApproveJobApply({ jobApplyId: id, empId: currentUser.employee.id }, {
        onSuccess: () => toast.success('Approved successfully'),
        onError: () => toast.error('Something error')
      })
    })
  }

  const rejectJobApply = async (id) => {
    await confirm({ description: "Are you sure to reject this candidate?" }).then(() => {
      handleRejectJobApply({ jobApplyId: id, empId: currentUser.employee.id }, {
        onSuccess: () => toast.success('Approved successfully'),
        onError: () => toast.error('Something error')
      })
    })
  }

  const showStatusLabel = (status) => {
    if (status === 'APPROVED') {
      return <span className='bg-[#C9F7F5] text-[#1BC5BD] text-sm w-[5rem] h-[2rem] flex justify-center items-center rounded-md'>Approved</span>
    } else if (status === 'REJECTED' || status === 'CANCELED') {
      return <span className='bg-[#FFE2E5] text-[#F64E60] text-sm w-[5rem] h-[2rem] flex justify-center items-center rounded-md'>Rejected</span>
    } else {
      return <span className='bg-[#FFF4DE] text-[#FFA800] text-sm w-[5rem] h-[2rem] flex justify-center items-center rounded-md'>Pending</span>
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers + 1}</TableCell>
        <TableCell>{item.candidate.name}</TableCell>
        <TableCell>{item.candidate.email}</TableCell>
        <TableCell align='center'>{moment(item.date).format('DD/MM/YYYY')}</TableCell>
        <TableCell align="center"><a href={item.cv.linkCV} target='_blank' title='View CV' className='flex justify-center' rel="noreferrer"><img src={cvIcon} alt="" width={'30rem'} /></a></TableCell>
        <TableCell align='center'>{showStatusLabel(item.status)}</TableCell>
        <TableCell align='center' style={{ display: 'flex', justifyContent: 'center' }}>
          {item.status === 'PENDING' && <>
            <img src={RejectIcon} alt="" style={{ width: '1.1rem', height: '1.1rem' }} title='Reject this candidate' className='hover:cursor-pointer mt-2' onClick={() => rejectJobApply(item.id)} />
            <img src={ApproveIcon} alt="" style={{ width: '2rem' }} title='Approve this candidate' className='ml-2 hover:cursor-pointer' onClick={() => approveJobApply(item.id)} />
          </>}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Education</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Language</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Experience</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Position</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Type of work</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={item.date}>
                    <TableCell sx={{ width: '15%' }} align='center'>{item.educationLevel}</TableCell>
                    <TableCell>{item.foreignLanguage}</TableCell>
                    <TableCell align='center'>{item.recruitmentRequest.experience}</TableCell>
                    <TableCell align='center'>{item.recruitmentRequest.position.name}</TableCell>
                    <TableCell align='center'>{item.recruitmentRequest.typeOfWork}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

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
  );
}
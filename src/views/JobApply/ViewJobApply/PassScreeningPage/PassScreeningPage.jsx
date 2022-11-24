import React, { useState } from 'react'

import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { approveJobApply, getJobApplyPassScreening, rejectJobApply } from '../../../../apis/jobApplyApi'
import ReactLoading from 'react-loading'
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ShowMoreIcon from '../../../../assets/icon/viewMore.png'
import ShowLessIcon from '../../../../assets/icon/viewLess.png'
import cvIcon from '../../../../assets/icon/cv.png'
import ApproveIcon from '../../../../assets/icon/approve.png'
import RejectIcon from '../../../../assets/icon/reject.png'
import { confirm } from "mui-confirm-modal";
import { positionName, responseStatus } from '../../../../utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react'

const PassScreeningPage = () => {

  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const recruimentId = useParams().id

  const [listJobApply, setListJobApply] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalPage: 10, currentPage: 1 })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getJobApplyPassScreening(currentUser.token, recruimentId, pagination.currentPage - 1, 5);
      if (response && response.data) {
        setListJobApply(response.data.responseList)
        setPagination({ ...pagination, totalPage: response.data.totalPage })
        console.log(response.data.responseList);
      }
      else {
        setListJobApply([])
      }
      setIsLoading(false)
    }
    fetchData();
  }, [pagination.currentPage])

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
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '20%' }}>Candidate</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '25%' }} align='center'>Email</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Date apply</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>CV</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Status</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listJobApply.map((item, id) => (
                  <Row key={id} ordinalNumbers={id} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

  const handleApproveJobApply = async (id) => {
    await confirm({ message: "Are you sure to aprrove this candidate?" }).then((response) => {
      if (response) {
        approveJobApply(currentUser.token, id, currentUser.employee.id).then((response) => {
          response.status === responseStatus.SUCCESS ? toast.success('Approved successfully') : toast.error('Something error')
        })
      }
    })
  }

  const handleRejectJobApply = async (id) => {
    await confirm({ message: "Are you sure to reject this candidate?" }).then((response) => {
      if (response) {
        rejectJobApply(currentUser.token, id, currentUser.employee.id).then((response) => {
          response.status === responseStatus.SUCCESS ? toast.success('Rejected successfully') : toast.error('Something error')
        })
      }
    })
  }
  const showStatusLabel = (status) => {
    if (status === 'APPROVED') {
      return <span className='bg-[#C9F7F5] text-[#1BC5BD] text-sm px-2 py-1 rounded-md'>APPROVED</span>
    } else if (status === 'REJECTED') {
      return <span className='bg-[#FFE2E5] text-[#F64E60] text-sm px-2 py-1 rounded-md'>Rejected</span>
    } else {
      return <span className='bg-[#FFF4DE] text-[#FFA800] text-sm px-2 py-1 rounded-md'>Pending</span>
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
        <TableCell align='center'>{item.date}</TableCell>
        <TableCell align="center"><a href={item.cv.linkCV} target='_blank' title='View CV' className='flex justify-center' rel="noreferrer"><img src={cvIcon} alt="" width={'40rem'} /></a></TableCell>
        <TableCell align='center'>{showStatusLabel(item.status)}</TableCell>
        <TableCell align='center' style={{ display: 'flex', justifyContent: 'space-around' }}>
          {currentUser.employee.position.name.toUpperCase().includes(positionName.POSITION_HR) && <React.Fragment>
            <img src={ApproveIcon} alt="" width={'40rem'} title='Approve this candidate' className='hover:cursor-pointer' onClick={() => handleApproveJobApply(item.id)} />
            <img src={RejectIcon} alt="" width={'40rem'} title='Reject this candidate' className='hover:cursor-pointer' onClick={() => handleRejectJobApply(item.id)} />
          </React.Fragment>}
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
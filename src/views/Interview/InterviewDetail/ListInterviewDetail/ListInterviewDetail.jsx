import React, { useState } from 'react'
import './ListInterviewDetail.scss'
import { useSelector } from 'react-redux';
import ShowMoreIcon from '../../../../assets/icon/viewMore.png'
import ShowLessIcon from '../../../../assets/icon/viewLess.png'
import EditIcon from '../../../../assets/icon/edit-icon.png'
import { positionName } from '../../../../utils/constants'
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListInterviewDetail = ({ listInterviewDetail }) => {

  return (
    <React.Fragment>
      <div className='listInterviewDetail-container'>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }} />
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '500', width: '5%' }}>#</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '20%' }}>Candidate</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '25%' }} align='center'>Email</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '8%' }} align='center'>Round</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Result</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '15%' }} align='center'>Date</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: '600', width: '10%' }} align='center'>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listInterviewDetail.map((item, id) => (
                <Row key={id} ordinalNumbers={id} item={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

export default ListInterviewDetail


const Row = (props) => {

  const { ordinalNumbers, item } = props;
  const currentUser = useSelector((state) => state.auth.login.currentUser)

  const [open, setOpen] = React.useState(false);

  const handleEditPlanDetail = () => {

  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers + 1}</TableCell>
        <TableCell>{item.interview.candidate.name}</TableCell>
        <TableCell>{item.interview.candidate.email}</TableCell>
        <TableCell align="center">{item.interview.round}</TableCell>
        <TableCell align='center'>{item.result}</TableCell>
        <TableCell align='center'>{item.end}</TableCell>
        {currentUser.employee.position.name.toUpperCase().includes(positionName.POSITION_HR) && <TableCell align='center'><img src={EditIcon} alt="" width={'30rem'} className='mx-auto' onClick={() => { handleEditPlanDetail() }} /></TableCell>}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Phone</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '25%' }} align='center'>Purpose</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Industry</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '15%' }} align='center'>Position</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Interview description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: '15%' }} align='center'>{item.interview.candidate.phone}</TableCell>
                    <TableCell>{item.interview.purpose}</TableCell>
                    <TableCell align='center'>{item.interview.jobApply.recruitmentRequest.industry}</TableCell>
                    <TableCell align='center'>{item.interview.jobApply.recruitmentRequest.position.name}</TableCell>
                    <TableCell align='right'>{item.interview.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Type</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '40%' }} align='center'>Address</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '30%' }} align='center'>Record meeting</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Detail description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>{item.interview.type}</TableCell>
                    <TableCell>{item.interview.type === 'ONLINE' ? item.interview.linkMeeting : item.interview.address}</TableCell>
                    <TableCell align='center'>{item.recordMeeting}</TableCell>
                    <TableCell align='right'>{item.interview.interviewDetail.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

    </React.Fragment>
  );
}
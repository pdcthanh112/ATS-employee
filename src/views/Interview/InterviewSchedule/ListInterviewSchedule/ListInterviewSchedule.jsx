import React, { useState } from 'react'
import './ListInterviewSchedule.scss'

import { useSelector } from 'react-redux'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import DeleteIcon from '.././../../../assets/icon/trash.png'
import CheckDoneIcon from '.././../../../assets/icon/check-done.png'
import AddResultIcon from '.././../../../assets/icon/addInterviewResult.png'
import moment from 'moment'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ReactLoading from 'react-loading'
import { departmentName, interviewStatus, interviewType, responseStatus } from '../../../../utils/constants'
import { Autocomplete, Box, Collapse, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Typography } from '@mui/material';
import ShowMoreIcon from '../../../../assets/icon/viewMore.png'
import ShowLessIcon from '../../../../assets/icon/viewLess.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { interviewResultData } from '../../../../utils/dropdownData';
import { createInterviewDetail } from '../../../../apis/interviewDetailApi';
import { useConfirm } from "material-ui-confirm";
import { useHandleApproveInterviewSchedule, useHandleCancelInterviewSchedule, useHandleCloseInterviewSchedule, useHandleRejectInterviewSchedule } from '../hooks/interviewScheduleHook'

const ListInterviewSchedule = ({ listInterviewSchedule, currPage }) => {

  return (
    <React.Fragment >
      <div className='w-[95%] mx-auto my-2'>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '8%' }} />
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '500', width: '2%' }}>#</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '20%' }}>Candidate</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Position</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '8%' }} align='center'>Type</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '20%' }} align='center'>Place</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='center'>Date</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '7%' }} align='center'>Time</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '6%' }} align='center'>Status</TableCell>
                <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '3%' }} align='center'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listInterviewSchedule?.map((item, id) => (
                <Row key={id} ordinalNumbers={(currPage - 1) * 10 + id + 1} item={item} />
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

    </React.Fragment >
  )
}

export default ListInterviewSchedule


const Row = (props) => {
  const { ordinalNumbers, item } = props;
  const currentUser = useSelector((state) => state.auth.login.currentUser)
  const categoryData = useSelector((state) => state.categoryData.data);

  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [openModalReason, setOpenModalReason] = useState(false)
  const [openModalInterviewDetail, setOpenModalInterviewDetail] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)


  const { mutate: handleApproveInterviewSchedule } = useHandleApproveInterviewSchedule();
  const { mutate: handleRejectInterviewSchedule } = useHandleRejectInterviewSchedule();
  const { mutate: handleCancelInterviewSchedule } = useHandleCancelInterviewSchedule();
  const { mutate: handleCloseInterviewSchedule } = useHandleCloseInterviewSchedule();

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: 600,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '1px solid #0F6B14',
    boxShadow: 24,
  };

  const formikCreateDetail = useFormik({
    initialValues: {
      description: '',
      end: new Date().toJSON().slice(0, 10),
      interviewID: '',
      note: '',
      recommendPositions: '',
      recordMeeting: '',
      result: ''
    },
    validationSchema: Yup.object({
      result: Yup.string().required('Please choose result'),
    }),
    onSubmit: async (values) => {
      formikCreateDetail.values.recommendPositions = formikCreateDetail.values.recommendPositions.toString();
      setIsCreating(true)
      await createInterviewDetail(values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Save successfully') : toast.error('Something error')
        setIsCreating(false)
      })
    }
  })

  const formikCancel = useFormik({
    initialValues: {
      interviewId: '',
      reason: '',
    },
    validationSchema: Yup.object({
      reason: Yup.string().required('Please input reason'),
    }),
    onSubmit: (values) => {
      setIsDeleting(true)
      try {
        handleCancelInterviewSchedule(values, {
          onSuccess: () => {
            setOpenModalReason(false)
            toast.success('Cancel successfully')
          },
          onError: () => {
            toast.error('Cancel fail')
          },
          onSettled: () => {
            setIsDeleting(false)
          }
        })
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  const approveInterviewByEmp = async (interviewId) => {
    await confirm({ description: "Are you sure to aprrove this interview?" }).then(() => {
      handleApproveInterviewSchedule({ idEmployee: currentUser.employee.id, idInterview: interviewId }, {
        onSuccess: () => toast.success('Confirm successfully'),
        onError: () => toast.error('Somethings error')
      })
    })
  }

  const rejectInterviewByEmp = async (interviewId) => {
    await confirm({ description: "Are you sure to reject this interview?" }).then(() => {
      handleRejectInterviewSchedule({ idEmployee: currentUser.employee.id, idInterview: interviewId }, {
        onSuccess: () => toast.success('Confirm successfully'),
        onError: () => toast.error('Somethings error')
      })
    })
  }

  const cancelInterview = async (interviewId) => {
    await confirm({ description: "Are you sure to cancel this interview?" }).then(() => {
      setOpenModalReason(true)
      formikCancel.values.interviewId = interviewId
    })
  }

  const closeInterview = async (interviewId) => {
    await confirm({ description: "Are you sure to close this interview?" }).then(() => {
      handleCloseInterviewSchedule(interviewId, {
        onSuccess: () => toast.success('Close interview successfully'),
        onError: () => toast.error('Somethings error')
      })
    })
  }

  const handleCreateInterviewDetail = (id) => {
    setOpenModalInterviewDetail(true)
    formikCreateDetail.values.interviewID = id;
  }


  const showStatusLabel = (status) => {
    if (status === 'APPROVED') {
      return <span className='bg-[#C9F7F5] text-[#1BC5BD] text-[0.7rem] w-[4rem] h-[1.8rem] flex justify-center items-center rounded-md'>Approved</span>
    } else if (status === 'REJECTED') {
      return <span className='bg-[#FFE2E5] text-[#F64E60] text-[0.7rem] w-[4rem] h-[1.8rem] flex justify-center items-center rounded-md'>Rejected</span>
    } else if (status === 'CANCELED') {
      return <span className='bg-[#FFE2E5] text-[#F64E60] text-[0.7rem] w-[4rem] h-[1.8rem] flex justify-center items-center rounded-md'>Canceled</span>
    } else if (status === 'DONE') {
      return <span className='bg-[#d6fcc5] text-[#20D489] text-[0.7rem] w-[4rem] h-[1.8rem] flex justify-center items-center rounded-md'>Done</span>
    } else {
      return <span className='bg-[#FFF4DE] text-[#FFA800] text-[0.7rem] w-[4rem] h-[1.8rem] flex justify-center items-center rounded-md'>Pending</span>
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>{open ? <img src={ShowLessIcon} alt="" width={'15rem'} /> : <img src={ShowMoreIcon} alt="" width={'15rem'} />}</IconButton>
        </TableCell>
        <TableCell>{ordinalNumbers}</TableCell>
        <TableCell>{item.candidateName}</TableCell>
        <TableCell align='center'>{item.jobApply.recruitmentRequest.position.name}</TableCell>
        <TableCell align='center' sx={{fontSize: '0.8rem'}}>{item.type}</TableCell>
        <TableCell>{item.type === interviewType.ONLINE ? <div>- Link meeting: {item.linkMeeting}</div> :
          <>
            <div className='khongchoxuonghang' title={item.address}>- Address: {item.address}</div>
            <div>- Room: {item.room}</div>
          </>}
        </TableCell>
        <TableCell align='center'>{moment(item.date).format('DD/MM/YYYY')}</TableCell>
        <TableCell align='center'>{item.time}</TableCell>
        <TableCell align='center'>{showStatusLabel(item.status)}</TableCell>
        <TableCell align='center'>
          {item.status === interviewStatus.PENDING && <>
            {currentUser.employee.department.id === departmentName.HR_DEPARTMENT ?
              <div className='flex justify-center' onClick={() => { cancelInterview(item.id) }}><img src={DeleteIcon} alt="" width={'25rem'} className='hover:cursor-pointer' title='Cancel this interview' /></div>
              : <>
                {item.employeeConfirm == null ? <div className='flex justify-center'>
                  <span onClick={() => { rejectInterviewByEmp(item.id) }}><img src={RejectIcon} alt="" width={'16rem'} className='mt-2 hover:cursor-pointer' title='Reject this interview' /></span>
                  <span onClick={() => { approveInterviewByEmp(item.id) }}><img src={ApproveIcon} alt="" width={'30rem'} className='ml-2 hover:cursor-pointer' title='Approve this interview' /></span>
                </div> : <div className='text-xs text-[#1DAF5A]'>You are confirmed: {item.employeeConfirm}</div>}
              </>}
          </>}

          {item.status === interviewStatus.APPROVED && currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <div className='flex justify-center' onClick={() => closeInterview(item.id)}><img src={CheckDoneIcon} alt="" width={'30rem'} className='hover:cursor-pointer' title='Close this interview' /></div>}

        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detail</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Purpose</TableCell>
                    <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600' }} align='center'>Interview description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{item.purpose}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && item.status === interviewStatus.DONE &&
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '1.1rem', fontWeight: '600', width: '10%' }} align='left'>Add interview result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align='right'>
                        <div className='hover:cursor-pointer bg-[#1daf5a] flex rounded-lg px-3 h-9 w-[16%]' onClick={() => handleCreateInterviewDetail(item.id)}>
                          <img src={AddResultIcon} alt='' style={{ width: '1.4rem', height: '1.4rem', margin: 'auto 0.2rem auto 0', padding: 0 }} />
                          <div className='text-[#FFF] my-auto'>Add result</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={openModalInterviewDetail} onClose={() => setOpenModalInterviewDetail(false)}>
        <Box sx={style}>
          <div className='px-5 py-5'>
            <form onSubmit={formikCreateDetail.handleSubmit}>
              <Autocomplete
                options={interviewResultData()}
                size={'small'}
                sx={{ width: '100%', marginRight: '2rem' }}
                renderInput={(params) => <TextField {...params} label="Result" />}
                onChange={(event, value) => { formikCreateDetail.setFieldValue('result', value) }} />
              {formikCreateDetail.errors.result && formikCreateDetail.touched.result && (
                <div className='text-[#ec5555]'>{formikCreateDetail.errors.result}</div>
              )}

              {formikCreateDetail.values.result === 'FAILURE' &&
                <div>
                  <Autocomplete
                    multiple
                    options={categoryData.position}
                    size={'small'}
                    sx={{ width: '100%', marginRight: '2rem', marginTop: '2rem' }}
                    renderInput={(params) => <TextField {...params} label="Recommend position" />}
                    onChange={(event, value) => { formikCreateDetail.setFieldValue('recommendPositions', value) }} />
                  {formikCreateDetail.errors.recommendPositions && formikCreateDetail.touched.recommendPositions && (
                    <div className='text-[#ec5555]'>{formikCreateDetail.errors.recommendPositions}</div>
                  )}
                </div>
              }

              <div className='mt-4'>
                <TextField label='Record meeting' variant="outlined" size='small' style={{ width: '100%' }} name='recordMeeting' value={formikCreateDetail.values.recordMeeting} onChange={formikCreateDetail.handleChange} />
                {formikCreateDetail.errors.recordMeeting && formikCreateDetail.touched.recordMeeting && (
                  <div className='text-[#ec5555]'>{formikCreateDetail.errors.recordMeeting}</div>
                )}
              </div>

              <div className='mt-4'>Description</div>
              <TextareaAutosize
                name='description'
                value={formikCreateDetail.values.description}
                minRows={3}
                maxRows={5}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikCreateDetail.handleChange}
              />
              {formikCreateDetail.errors.description && formikCreateDetail.touched.description && (
                <div className='text-[#ec5555]'>{formikCreateDetail.errors.description}</div>
              )}

              <div className='mt-4'>Note</div>
              <TextareaAutosize
                name='note'
                value={formikCreateDetail.values.note}
                minRows={3}
                maxRows={5}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikCreateDetail.handleChange}
              />
              {formikCreateDetail.errors.note && formikCreateDetail.touched.note && (
                <div className='text-[#ec5555]'>{formikCreateDetail.errors.note}</div>
              )}

              <div className='flex justify-evenly mt-5'>
                <button type='button' onClick={() => setOpenModalInterviewDetail(false)} className='btn-create bg-[#F64E60]'>Cancel</button>
                <button className='btn-create bg-[#20D489]' onClick={formikCreateDetail.handleSubmit}>Save</button>
                {isCreating && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal open={openModalReason} onClose={() => { setOpenModalReason(false); formikCancel.handleReset() }}>
        <Box sx={style}>
          <div className='px-2 py-3'>
            <form onSubmit={formikCancel.handleSubmit}>
              <div>Please input reason</div>
              <TextareaAutosize
                name='reason'
                value={formikCancel.values.reason}
                minRows={3}
                maxRows={5}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikCancel.handleChange}
              />
              {formikCancel.errors.reason && formikCancel.touched.reason && (
                <div className='text-[#ec5555]'>{formikCancel.errors.reason}</div>
              )}

              <div className='flex justify-evenly mt-5'>
                <button type='button' onClick={() => setOpenModalReason(false)} className='btn-create bg-[#C1C1C1]'>Cancel</button>
                <button className='btn-create bg-[#F64E60]' onClick={formikCancel.handleSubmit}>Delete</button>
                {isDeleting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={35} height={35} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
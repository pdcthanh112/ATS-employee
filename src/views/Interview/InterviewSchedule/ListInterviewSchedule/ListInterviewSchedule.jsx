import React, { useState, useEffect } from 'react'
import './ListInterviewSchedule.scss'

import { useSelector } from 'react-redux'
import InterviewIcon from '../../../../assets/icon/date-time-icon.png'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import EditIcon from '../../../../assets/icon/edit.png'
import DeleteIcon from '.././../../../assets/icon/trash.png'
import CheckDoneIcon from '.././../../../assets/icon/check-done.png'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import ReactLoading from 'react-loading'
import { interviewStatus, interviewType, positionName, responseStatus } from '../../../../utils/constants'
import { cancelInterview, closeInterview, confirmInterview, rejectInterview } from '../../../../apis/interviewScheduleApi'
import { Autocomplete, Box, Modal, TextareaAutosize, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirm } from "mui-confirm-modal";
import { interviewResultData, interviewRoundData } from '../../../../utils/dropdownData'
import { createInterviewDetail } from '../../../../apis/interviewDetailApi'
import { FormControlLabel, Switch } from '@material-ui/core'

const ListInterviewSchedule = ({ listInterviewSchedule }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const [openModalReason, setOpenModalReason] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalInterviewDetail, setOpenModalInterviewDetail] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (isOnline) {
      formikEdit.values.type = interviewType.ONLINE
      formikEdit.values.address = ''
      formikEdit.values.room = ''
    } else {
      formikEdit.values.type = interviewType.OFFLINE
      formikEdit.values.linkMeeting = ''
    }
  }, [isOnline])

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


  const formikEdit = useFormik({
    initialValues: {
      address: '',
      candidateId: '',
      date: '',
      description: '',
      employeeIds: [],
      jobApplyId: 0,
      linkMeeting: '',
      purpose: '',
      room: '',
      round: '',
      subject: '',
      time: '',
      type: ''
    },
    validationSchema: Yup.object({
      reason: Yup.string().required('Please input reason'),
    }),
    onSubmit: async (values) => {
      setIsEditting(true)
      await cancelInterview(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Cancel successfully') : toast.error('Cancel fail')
        setIsEditting(false)
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
    onSubmit: async (values) => {
      setIsDeleting(true)
      await cancelInterview(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Cancel successfully') : toast.error('Cancel fail')
        setIsDeleting(false)
        setOpenModalReason(false)
      })
    }
  })

  const formikCreateDetail = useFormik({
    initialValues: {
      description: '',
      end: new Date().toJSON().slice(0, 10),
      interviewID: '',
      recordMeeting: '',
      result: ''
    },
    validationSchema: Yup.object({
      result: Yup.string().required('Please choose result'),
    }),
    onSubmit: async (values) => {
      console.log('create', values);
      setIsCreating(true)
      await createInterviewDetail(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Save successfully') : toast.error('Something error')
        setIsCreating(false)
      })
    }
  })

  const confirmInterviewByEmp = async (interviewId) => {
    await confirm({ message: "Are you sure to aprrove this interview?" }).then((response) => {
      if (response) {
        confirmInterview(currentUser.token, currentUser.employee.id, interviewId).then((response) => {
          response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
        })
      }
    })
  }

  const rejectInterviewByEmp = async (interviewId) => {
    await confirm({ message: "Are you sure to reject this interview?" }).then((response) => {
      if (response) {
        rejectInterview(currentUser.token, currentUser.employee.id, interviewId).then((response) => {
          response.status === responseStatus.SUCCESS ? toast.success('Reject successfully') : toast.error('Something error')
        })
      }
    })
  }

  const handleCancelInterview = async (interviewId) => {
    await confirm({ message: "Are you sure to cancel this interview?" }).then((response) => {
      if (response) {
        setOpenModalReason(true)
        formikCancel.values.interviewId = interviewId
      }
    })
  }

  const handleCloseInterview = async (interviewId) => {
    await confirm({ message: "Are you sure to close this interview?" }).then((response) => {
      if (response) {
        closeInterview(currentUser.token, interviewId).then(response => {
          response.status === responseStatus.SUCCESS ? toast.success('Close interview successfully') : toast.error('Something error')
        })
      }
    })
  }

  const handleCreateInterviewDetail = (id) => {
    setOpenModalInterviewDetail(true)
    formikCreateDetail.values.interviewID = id;
  }

  return (
    <React.Fragment >
      <div className='listInterview-container'>
        {listInterviewSchedule && listInterviewSchedule.map((item) => (
          <div key={item.id} className='listInterview-item'>
            <div className='inline-flex w-[100%]'>
              <div className='flex'>
                <div>
                  <div className='font-semibold text-lg w-24'>{item.date}</div>
                  <div className='flex justify-end font-bold text-xl'>{item.time}</div>
                </div>
                <div className='ml-4'><img src={InterviewIcon} alt="" width={'50rem'} /></div>
              </div>
              {item.status === interviewStatus.PENDING &&
                <div className='flex justify-between w-[60%] ml-4'>
                  <div className='bg-[#FFF4DE] text-[#FFA800] text-sm font-semibold px-3 py-2 rounded-lg h-9'>PENDING</div>
                  <div className='flex'>
                    {currentUser.employee.position.name === positionName.POSITION_HR ?
                      <span onClick={() => { handleCancelInterview(item.id) }}><img src={DeleteIcon} alt="" width={'30rem'} className='hover:cursor-pointer' title='Cancel this interview' /></span>
                      : <React.Fragment>
                        {item.employeeConfirm && <React.Fragment>
                          <span onClick={() => { confirmInterviewByEmp(item.id) }}><img src={ApproveIcon} alt="" width={'40rem'} className='mr-2 hover:cursor-pointer' title='Approve this interview' /></span>
                          <span onClick={() => { rejectInterviewByEmp(item.id) }}><img src={RejectIcon} alt="" width={'20rem'} className='mt-2 hover:cursor-pointer' title='Reject this interview' /></span>
                        </React.Fragment>}
                      </React.Fragment>}
                  </div>
                </div>}
              {item.status === interviewStatus.DONE && <div className='flex justify-between'>
                <div className='bg-[#E9FCE9] text-[#00FF00] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>DONE</div>
                {currentUser.employee.position.name === positionName.POSITION_HR && <div className='mt-2  hover:cursor-pointer hover:underline hover:text-[#116835]' onClick={() => handleCreateInterviewDetail(item.id)}>Add result of interview</div>}
              </div>}
              {item.status === interviewStatus.APPROVED && <div className='flex justify-between '>
                <div className='bg-[#C9F7F5] text-[#1BC5BD] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>APPROVED</div>
                <div onClick={() => handleCloseInterview(item.id)}><img src={CheckDoneIcon} alt="" width={'30rem'} className='hover:cursor-pointer ml-2' title='Close this interview' /></div>
              </div>}
              {item.status === interviewStatus.CANCELED && <div className='bg-[#FFE2E5] text-[#F64E60] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>CANCELED</div>}
            </div>

            <div className='font-semibold text-lg grid justify-end mb-3'>
              <div>Round: {item.round}</div>
              <div>
                {item.type === interviewType.ONLINE ? <span className='bg-[#20D489] text-sm px-4 py-2 rounded-xl'>ONLINE</span> : <span>Room: {item?.room}</span>}
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
            <div className='mt-2'>
              <div className='font-semibold text-lg'>Purpose</div>
              <div className='field-item'>{item.purpose}</div>
            </div>
            <div className='mt-2'>
              <div className='font-semibold text-lg'>Description</div>
              <div className='field-item'>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <Box sx={style}>
          <div className='px-2 py-3'>
            <form onSubmit={formikCancel.handleSubmit}>
              <div className='px-2 py-3'>
                <div className='w-full flex mt-3'>
                  <div className='w-[22%] mr-3'>
                    <Autocomplete
                      options={interviewRoundData()}
                      size={'small'}
                      sx={{ width: '100%', marginRight: '2rem' }}
                      renderInput={(params) => <TextField {...params} label="Round" />}
                      onChange={(event, value) => { formikEdit.setFieldValue('round', value) }}
                    />
                    {formikEdit.errors.round && formikEdit.touched.round && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.round}</div>
                    )}
                  </div>
                  <div className='w-[100%]'>
                    <TextField label='Subject' variant="outlined" size='small' style={{ width: '100%' }} name='subject' value={formikEdit.values.subject} onChange={formikEdit.handleChange} />
                    {formikEdit.errors.subject && formikEdit.touched.subject && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.subject}</div>
                    )}
                  </div>
                </div>
                <div className='flex justify-evenly mt-3'>
                  <div>
                    <TextField type={'date'} variant="outlined" size='small' style={{ width: '100%' }} name='date' value={formikEdit.values.date} onChange={formikEdit.handleChange} />
                    {formikEdit.errors.date && formikEdit.touched.date && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.date}</div>
                    )}
                  </div>
                  <div>
                    <TextField type={'time'} variant="outlined" size='small' style={{ width: '100%' }} name='time' value={formikEdit.values.time} onChange={formikEdit.handleChange} />
                    {formikEdit.errors.time && formikEdit.touched.time && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.time}</div>
                    )}
                  </div>
                </div>

                <div className='mt-4'>Purpose</div>
                <TextareaAutosize
                  name='purpose'
                  value={formikEdit.values.purpose}
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                  onChange={formikEdit.handleChange}
                />
                {formikEdit.errors.purpose && formikEdit.touched.purpose && (
                  <div className='text-[#ec5555]'>{formikEdit.errors.purpose}</div>
                )}

                <FormControlLabel control={<Switch onChange={(event) => setIsOnline(event.target.checked)} />} label={isOnline ? 'Online' : 'Offline'} />

                {isOnline ? <div>
                  <TextField label='Google meet' variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='linkMeeting' value={formikEdit.values.linkMeeting} onChange={formikEdit.handleChange} />
                </div> : <div>
                  <div>
                    <TextField label='Room' variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='room' value={formikEdit.values.room} onChange={formikEdit.handleChange} />
                    {formikEdit.errors.room && formikEdit.touched.room && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.room}</div>
                    )}
                  </div>
                  <div>
                    <TextField label='Address' variant="outlined" size='small' style={{ width: '100%', marginTop: '1rem' }} name='address' value={formikEdit.values.address} onChange={formikEdit.handleChange} />
                    {formikEdit.errors.address && formikEdit.touched.address && (
                      <div className='text-[#ec5555]'>{formikEdit.errors.address}</div>
                    )}
                  </div>
                </div>}

                <div className='mt-4'>Description</div>
                <TextareaAutosize
                  name='description'
                  value={formikEdit.values.description}
                  minRows={2}
                  maxRows={5}
                  style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                  onChange={formikEdit.handleChange}
                />
                {formikEdit.errors.description && formikEdit.touched.description && (
                  <div className='text-[#ec5555]'>{formikEdit.errors.description}</div>
                )}
              </div>
              <div className='flex justify-evenly'>
                <button className='btn-create bg-[#20D489]' onClick={formikEdit.handleSubmit}>Save</button>
                {isEditting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal open={openModalReason} onClose={() => setOpenModalReason(false)}>
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
                {isDeleting && <ReactLoading className='ml-2' type='spin' color='#FF4444' width={37} />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>

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

              <div className='mt-4'>
                <TextField label='Record meeting' variant="outlined" size='small' style={{ width: '100%' }} name='recordMeeting' value={formikCreateDetail.values.recordMeeting} onChange={formikCreateDetail.handleChange} />
                {formikCreateDetail.errors.recordMeeting && formikCreateDetail.touched.recordMeeting && (
                  <div className='text-[#ec5555]'>{formikCreateDetail.errors.recordMeeting}</div>
                )}
              </div>

              <div className='mt-4'>Description</div>
              <TextareaAutosize
                name='description'
                value={formikCancel.values.description}
                minRows={3}
                maxRows={5}
                style={{ width: '100%', border: '1px solid #116835', padding: '0.3rem 0.7rem 1rem 1rem' }}
                onChange={formikCreateDetail.handleChange}
              />
              {formikCreateDetail.errors.description && formikCreateDetail.touched.description && (
                <div className='text-[#ec5555]'>{formikCreateDetail.errors.description}</div>
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
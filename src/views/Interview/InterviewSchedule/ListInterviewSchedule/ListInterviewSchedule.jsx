import React, { useState } from 'react'
import './ListInterviewSchedule.scss'

import { useSelector } from 'react-redux'
import InterviewIcon from '../../../../assets/icon/date-time-icon.png'
import ApproveIcon from '../../../../assets/icon/check.png'
import RejectIcon from '../../../../assets/icon/close.png'
import DeleteIcon from '.././../../../assets/icon/trash.png'
import CheckDoneIcon from '.././../../../assets/icon/check-done.png'
import AddResultIcon from '.././../../../assets/icon/addInterviewResult.png'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import ReactLoading from 'react-loading'
import { departmentName, interviewStatus, interviewType, responseStatus } from '../../../../utils/constants'
import { cancelInterview, closeInterview, confirmInterview, rejectInterview } from '../../../../apis/interviewScheduleApi'
import { Autocomplete, Box, Modal, TextareaAutosize, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { interviewResultData } from '../../../../utils/dropdownData';
import { createInterviewDetail } from '../../../../apis/interviewDetailApi';
import { useConfirm } from "material-ui-confirm";

const ListInterviewSchedule = ({ listInterviewSchedule }) => {

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const categoryData = useSelector((state) => state.categoryData.data);
  const confirm = useConfirm();

  const [openModalReason, setOpenModalReason] = useState(false)
  const [openModalInterviewDetail, setOpenModalInterviewDetail] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

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
      await createInterviewDetail(currentUser.token, values).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Save successfully') : toast.error('Something error')
        setIsCreating(false)
      })
    }
  })

  const confirmInterviewByEmp = async (interviewId) => {
    await confirm({ description: "Are you sure to aprrove this interview?" }).then(() => {
      confirmInterview(currentUser.token, currentUser.employee.id, interviewId).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Confirm successfully') : toast.error('Something error')
      })
    })
  }

  const rejectInterviewByEmp = async (interviewId) => {
    await confirm({ description: "Are you sure to reject this interview?" }).then(() => {
      rejectInterview(currentUser.token, currentUser.employee.id, interviewId).then((response) => {
        response.status === responseStatus.SUCCESS ? toast.success('Reject successfully') : toast.error('Something error')
      })
    })
  }

  const handleCancelInterview = async (interviewId) => {
    await confirm({ description: "Are you sure to cancel this interview?" }).then(() => {
      setOpenModalReason(true)
      formikCancel.values.interviewId = interviewId
    })
  }

  const handleCloseInterview = async (interviewId) => {
    await confirm({ description: "Are you sure to close this interview?" }).then(() => {
      closeInterview(currentUser.token, interviewId).then(response => {
        response.status === responseStatus.SUCCESS ? toast.success('Close interview successfully') : toast.error('Something error')
      })
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
                    {currentUser.employee.department.id === departmentName.HR_DEPARTMENT ?
                      <span onClick={() => { handleCancelInterview(item.id) }}><img src={DeleteIcon} alt="" width={'30rem'} className='hover:cursor-pointer' title='Cancel this interview' /></span>
                      : <React.Fragment>
                        {item.employeeConfirm == null && <React.Fragment>
                          <span onClick={() => { confirmInterviewByEmp(item.id) }}><img src={ApproveIcon} alt="" width={'40rem'} className='mr-2 hover:cursor-pointer' title='Approve this interview' /></span>
                          <span onClick={() => { rejectInterviewByEmp(item.id) }}><img src={RejectIcon} alt="" width={'20rem'} className='mt-2 hover:cursor-pointer' title='Reject this interview' /></span>
                        </React.Fragment>}
                      </React.Fragment>}
                  </div>
                </div>}
              {item.status === interviewStatus.DONE && <div className='flex justify-between w-[65%]'>
                <div className='bg-[#E9FCE9] text-[#00FF00] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>DONE</div>
                {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <div className='hover:cursor-pointer bg-[#1daf5a] flex rounded-lg px-3 h-9' onClick={() => handleCreateInterviewDetail(item.id)}><img src={AddResultIcon} alt='' style={{width: '1.4rem', height: '1.4rem', margin: 'auto 0.2rem auto 0', padding: 0}}/><div className='text-[#FFF] my-auto'>Add result</div></div>}
              </div>}
              {item.status === interviewStatus.APPROVED && <div className='flex justify-between '>
                <div className='bg-[#C9F7F5] text-[#1BC5BD] text-sm font-semibold px-3 py-2 rounded-lg h-9 ml-4'>APPROVED</div>
                {currentUser.employee.department.id === departmentName.HR_DEPARTMENT && <div onClick={() => handleCloseInterview(item.id)}><img src={CheckDoneIcon} alt="" width={'30rem'} className='hover:cursor-pointer ml-2' title='Close this interview' /></div>}
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